const defaultBase =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8080/api`
    : 'http://localhost:8080/api';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || defaultBase;

async function postJson<T>(path: string, token: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface CreateLinkTokenResponse {
  link_token: string;
}

export interface ExchangePublicTokenPayload {
  public_token: string;
}

export interface AnalyzeFinancesResponse {
  message: string;
  financialProfile: {
    estimatedMonthlyIncome: number | null;
    existingMonthlyAutoPayment: number | null;
    existingMonthlyOtherLoans: number | null;
    totalMonthlyDebt: number;
    creditCardDebt: number | null;
    hasExistingAutoLoan: boolean;
    debtToIncomeRatio: number | null;
    analyzedAt: string;
  };
}

export function createLinkToken(token: string): Promise<CreateLinkTokenResponse> {
  return postJson<CreateLinkTokenResponse>('/plaid/create_link_token', token);
}

export function exchangePublicToken(
  token: string,
  payload: ExchangePublicTokenPayload
): Promise<{ message: string; item_id: string }> {
  return postJson<{ message: string; item_id: string }>('/plaid/exchange_public_token', token, payload);
}

export function analyzeFinances(token: string): Promise<AnalyzeFinancesResponse> {
  return postJson<AnalyzeFinancesResponse>('/plaid/analyze_finances', token);
}


