import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { auth } from 'express-oauth2-jwt-bearer';
import { env } from './config/env.js';

// JWT middleware configured from environment
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

// Scope guard middleware for routes requiring specific scopes
function requireScope(scope: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const scopes = (req.auth && (req.auth.payload.scope as string | undefined)) || '';
    const has = scopes.split(' ').includes(scope);
    if (!has) return res.status(403).json({ error: 'insufficient_scope', required: scope });
    next();
  };
}

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json());

// Root index for convenience
app.get('/', (_req, res) => {
  res.json({
    name: 'Toyota Nexus API',
    status: 'ok',
    version: process.env.npm_package_version || 'dev',
    endpoints: {
      health: '/health',
      authorized: '/authorized',
      data: '/data'
    }
  });
});

// Public health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Protected route example
app.get('/authorized', jwtCheck, (_req, res) => {
  res.json({ message: 'Secured Resource' });
});

// Protected route requiring scope
app.get('/data', jwtCheck, requireScope('read:data'), (_req, res) => {
  res.json({ data: [ { id: 1, name: 'Sample Item' }, { id: 2, name: 'Another Item' } ] });
});

// Error handler for auth errors & generic fallback
// express-oauth2-jwt-bearer throws errors with status codes we can surface
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err && (err.status === 401 || err.status === 403)) {
    return res.status(err.status).json({ error: err.code || 'auth_error', message: err.message });
  }
  console.error('[error]', err);
  res.status(500).json({ error: 'internal_error' });
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
