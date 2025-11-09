import { env } from '../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function geminiChat(user: string, context: any) {
  if (!env.GEMINI_API_KEY) {
    return "Gemini is not configured on the server. Enable it by adding GEMINI_API_KEY in .env.";
  }
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `You are Toyota Nexus AI. Use the provided JSON context faithfully.\nCONTEXT=${JSON.stringify(context)}\nUSER=${user}\nReturn concise, practical guidance (<= 120 words).`;
  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}
