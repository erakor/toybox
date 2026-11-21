import type { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'ok' | 'warn' | 'danger' | 'info' | 'neutral'
}

const TONE = {
  ok: 'bg-emerald-200 text-emerald-950',
  warn: 'bg-amber-200 text-amber-950',
  danger: 'bg-red-200 text-red-950',
  info: 'bg-sky-200 text-sky-950',
  neutral: 'bg-slate-200 text-slate-950',
} as const

export function Badge({ tone = 'neutral', className = '', ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 bv-border px-2.5 py-0.5 text-[11px] font-bold ${TONE[tone]} ${className}`}
      {...rest}
    />
  )
}
