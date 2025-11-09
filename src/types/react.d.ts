type StateUpdater<S> = (value: S | ((prev: S) => S)) => void

export type ChangeEvent<T = any> = { target: T }

export function useState<S>(initialState: S | (() => S)): [S, StateUpdater<S>]
export function useMemo<T>(factory: () => T, deps: unknown[]): T

declare module 'react' {
  export type ChangeEvent<T = any> = { target: T }

  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void]
  export function useMemo<T>(factory: () => T, deps: unknown[]): T

  export type ReactNode = any
}

declare namespace JSX {
  interface IntrinsicElements {
    [element: string]: any
  }
}

