declare module 'react-plaid-link' {
  export interface PlaidLinkOnSuccessMetadata {
    institution?: { name?: string | null };
    accounts?: Array<{ id: string; mask?: string | null; name?: string | null }>;
    [key: string]: unknown;
  }

  export interface PlaidLinkConfig {
    token: string;
    onSuccess: (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => void;
    onExit?: (error?: { error_code?: string } | null) => void;
  }

  export function usePlaidLink(config: PlaidLinkConfig): { open: () => void; ready: boolean };
}


