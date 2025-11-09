declare module 'framer-motion' {
  export interface MotionProps {
    children?: any
    className?: string
    initial?: Record<string, unknown>
    animate?: Record<string, unknown>
    exit?: Record<string, unknown>
    transition?: Record<string, unknown>
    [key: string]: unknown
  }

  export type MotionComponent = (props: MotionProps) => any

  export const motion: Record<string, MotionComponent>

  export interface AnimatePresenceProps {
    children?: any
    initial?: boolean
    mode?: 'popLayout' | 'wait' | undefined
  }

  export const AnimatePresence: (props: AnimatePresenceProps) => any
}

