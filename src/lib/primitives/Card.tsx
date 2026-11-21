import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
}

/** Card with an optional header row (title, icon, actions). */
export function Card({ title, icon, actions, className = '', children, ...rest }: CardProps) {
  const hasHeader = title !== undefined || icon !== undefined || actions !== undefined
  return (
    <div className={`cartoon-box bv-card rounded-3xl overflow-hidden ${className}`} {...rest}>
      {hasHeader && <CardHeader title={title} icon={icon} actions={actions} />}
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  title?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
}

export function CardHeader({ title, icon, actions }: CardHeaderProps) {
  return (
    <div className="px-5 py-3.5 border-b-[3px] bv-border bv-card-header flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 font-display font-bold text-sm bv-ink">
        {icon}
        {title}
      </h3>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
