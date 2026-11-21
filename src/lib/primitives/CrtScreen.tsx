import type { HTMLAttributes } from 'react'

export interface CrtScreenProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a soft phosphor glow around the screen. */
  glow?: boolean
}

export function CrtScreen({ glow = false, className = '', style, ...rest }: CrtScreenProps) {
  return (
    <div
      className={`crt-screen rounded-2xl ${className}`}
      style={glow ? { boxShadow: '0 0 18px 2px var(--bv-ink)', ...style } : style}
      {...rest}
    />
  )
}
