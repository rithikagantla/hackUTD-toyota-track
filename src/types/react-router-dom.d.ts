declare module 'react-router-dom' {
  import type { FC, ReactNode } from 'react'

  export interface Location {
    pathname: string
    search: string
    hash: string
    state: unknown
    key: string
  }

  export type NavigateFunction = (
    to: string,
    options?: { replace?: boolean; state?: unknown }
  ) => void

  export function useNavigate(): NavigateFunction
  export function useLocation(): Location
  export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): Readonly<T>

  export interface LinkProps {
    to: string
    children?: ReactNode
    className?: string
    replace?: boolean
    state?: unknown
  }

  export const Link: FC<LinkProps>

  export interface BrowserRouterProps {
    children?: ReactNode
  }

  export const BrowserRouter: FC<BrowserRouterProps>

  export interface RoutesProps {
    children?: ReactNode
  }

  export const Routes: FC<RoutesProps>

  export interface RouteProps {
    path?: string
    element?: ReactNode
    index?: boolean
  }

  export const Route: FC<RouteProps>
  export const Outlet: FC

  export interface NavigateProps {
    to: string
    replace?: boolean
    state?: unknown
  }

  export const Navigate: FC<NavigateProps>
}

