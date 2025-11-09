import 'react-router-dom';
import { ReactNode } from 'react';

declare module 'react-router-dom' {
  export interface BrowserRouterProps {
    future?: {
      v7_startTransition?: boolean;
      v7_relativeSplatPath?: boolean;
    };
  }

  export interface RouteProps {
    caseSensitive?: boolean;
    children?: ReactNode;
    element?: ReactNode;
    index?: boolean;
    path?: string;
  }
}
