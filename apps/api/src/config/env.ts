import 'dotenv/config';

function req(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT || 5001),
  NODE_ENV: process.env.NODE_ENV || 'development',
  WEB_ORIGIN: req('WEB_ORIGIN'),
  // Optional: not used if the project doesn't require a database
  MONGODB_URI: process.env.MONGODB_URI || '',
  AUTH0_DOMAIN: req('AUTH0_DOMAIN'),
  AUTH0_AUDIENCE: req('AUTH0_AUDIENCE'),
  AUTH0_ISSUER: req('AUTH0_ISSUER'),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
