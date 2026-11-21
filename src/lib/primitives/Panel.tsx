import type { ElementType, HTMLAttributes } from 'react'

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  size?: 'md' | 'sm'
  tone?: 'plate' | 'plate-alt' | 'card'
  as?: ElementType
}

const TONE_CLASS = {
  plate: 'steel-plate',
  'plate-alt': 'steel-plate-dark',
  card: 'bv-card',
} as const

/** Inked toy panel: the `cartoon-box` frame with a themed background. */
export function Panel({
  size = 'md',
  tone = 'card',
  as: Tag = 'div',
  className = '',
  ...rest
}: PanelProps) {
  const frame = size === 'sm' ? 'cartoon-box-sm rounded-2xl' : 'cartoon-box rounded-3xl'
  return <Tag className={`${frame} ${TONE_CLASS[tone]} ${className}`} {...rest} />
}
