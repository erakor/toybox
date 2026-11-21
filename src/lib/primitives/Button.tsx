import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'ghost'
  size?: 'sm' | 'md'
}

const VARIANT = {
  default: 'bg-white text-slate-950 hover:bg-amber-200',
  accent: 'text-[var(--bv-accent-text)] bg-[var(--bv-accent)] hover:brightness-95',
  ghost: 'bg-transparent bv-ink hover:bg-black/10',
} as const

const SIZE = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
} as const

export function Button({
  variant = 'default',
  size = 'sm',
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`cartoon-btn rounded-2xl font-bold cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${SIZE[size]} ${VARIANT[variant]} ${className}`}
      {...rest}
    />
  )
}
