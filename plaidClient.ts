import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

type PlaidEnvKey = keyof typeof PlaidEnvironments;

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = (process.env.PLAID_ENV || 'sandbox').toLowerCase() as PlaidEnvKey;
const PLAID_BASE = PlaidEnvironments[PLAID_ENV] ?? PlaidEnvironments.sandbox;

let client: PlaidApi | null = null;

export function isPlaidConfigured(): boolean {
  return Boolean(PLAID_CLIENT_ID && PLAID_SECRET);
}

export function getPlaidClient(): PlaidApi | null {
  if (!isPlaidConfigured()) return null;
  if (client) return client;

  const configuration = new Configuration({
    basePath: PLAID_BASE,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID ?? '',
        'PLAID-SECRET': PLAID_SECRET ?? ''
      }
    }
  });

  client = new PlaidApi(configuration);
  return client;
}

export function getPlaidEnvironment(): string {
  return PLAID_ENV;
}


