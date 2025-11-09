import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { auth } from "express-oauth2-jwt-bearer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import plaidRouter from "./plaidRoutes.js";
import { connectDatabase } from "./db.ts";

const app = express();
app.use(express.json());

connectDatabase().catch((error) => {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1);
});

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: corsOrigin, credentials: true }));

const port = Number(process.env.PORT || 8080);
const apiKey = process.env.GEMINI_API_KEY;
const requireAuth = (process.env.REQUIRE_AUTH_FOR_CHAT || "false").toLowerCase() === "true";

if (!apiKey) {
  console.error("❌ Missing GEMINI_API_KEY in environment.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

app.use("/api/plaid", plaidRouter);

const ChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "model", "system"]),
      content: z.string()
    })
  ),
  model: z.string().optional(),          // e.g. "gemini-2.0-flash-exp"
  temperature: z.number().optional()
});

// Optional Auth0 JWT validation
let requireJwt: ReturnType<typeof auth> | undefined;
if (requireAuth) {
  const issuerBaseURL = process.env.AUTH0_ISSUER;
  const audience = process.env.AUTH0_AUDIENCE;
  if (!issuerBaseURL || !audience) {
    console.warn("⚠️ REQUIRE_AUTH_FOR_CHAT is true, but AUTH0_ISSUER or AUTH0_AUDIENCE is missing.");
  } else {
    requireJwt = auth({
      audience,
      issuerBaseURL
    });
  }
}

const wrapAuth = (handler: express.RequestHandler): express.RequestHandler => {
  if (requireAuth && requireJwt) {
    return (req, res, next) => requireJwt!(req, res, (err?: any) => (err ? next(err) : handler(req, res, next)));
  }
  return handler;
};

// Non-streaming endpoint
app.post("/api/chat", wrapAuth(async (req, res) => {
  const parsed = ChatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

  const { messages, model = "gemini-2.0-flash-exp", temperature = 0.5 } = parsed.data;
  const sys = messages.find(m => m.role === "system")?.content;

  try {
    const m = genAI.getGenerativeModel({
      model,
      systemInstruction: sys || undefined
    });

    const userLast = messages[messages.length - 1];
    const result = await m.generateContent({
      contents: [{ role: "user", parts: [{ text: userLast.content }]}],
      generationConfig: { temperature }
    });

    return res.json({ text: result.response.text() });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || "Gemini error" });
  }
}));

// Streaming endpoint (SSE)
app.post("/api/chat/stream", wrapAuth(async (req, res) => {
  const parsed = ChatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

  const { messages, model = "gemini-2.0-flash-exp", temperature = 0.5 } = parsed.data;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const sys = messages.find(m => m.role === "system")?.content;
    const history = messages
      .filter(m => m.role !== "system")
      .map(m => ({ role: m.role, parts: [{ text: m.content }] }));

    const m = genAI.getGenerativeModel({
      model,
      systemInstruction: sys || undefined
    });

    const chat = m.startChat({
      history,
      generationConfig: { temperature }
    });
    const userLast = messages[messages.length - 1];
    const stream = await chat.sendMessageStream(userLast.content);

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      if (text) res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
    }

    const final = await stream.response;
    res.write(`data: ${JSON.stringify({ done: true, text: final.text() })}\n\n`);
    res.end();
  } catch (e: any) {
    console.error(e);
    try {
      res.write(`data: ${JSON.stringify({ error: e.message || "Gemini stream error" })}\n\n`);
    } finally {
      res.end();
    }
  }
}));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`✅ API listening on http://localhost:${port}`);
});
