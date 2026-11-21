import type { HTMLAttributes } from 'react'

export interface StickerProps extends HTMLAttributes<HTMLDivElement> {
  tilt?: 'left' | 'right' | 'none'
}

const TILT = { left: 'bv-sticker-tilt-l', right: 'bv-sticker-tilt-r', none: '' } as const

/** Die-cut sticker that tilts slightly in the Cream-Halo theme. */
export function Sticker({ tilt = 'left', className = '', ...rest }: StickerProps) {
  return <div className={`${TILT[tilt]} ${className}`} {...rest} />
}
