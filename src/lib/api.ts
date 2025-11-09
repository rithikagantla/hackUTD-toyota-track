// Simple API client for frontend -> backend calls
// Set VITE_API_URL in your frontend .env (e.g., http://localhost:8080)

// Vite exposes env vars on import.meta.env; add a minimal type to satisfy TS without a global d.ts yet
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const API_URL: string = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8080';

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} -> ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  health: () => apiGet<{ status: string }>(`/health`),
  root: () => apiGet<{ name: string; status: string }>(`/`),
  authorized: (token: string) => apiGet<{ message: string }>(`/authorized`, token),
  data: (token: string) => apiGet<{ data: unknown }>(`/data`, token),
};
