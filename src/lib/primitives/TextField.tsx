import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
}

export function TextField({ label, icon, id, className = '', ...rest }: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={className}>
      <label htmlFor={inputId} className="block mb-1 text-[11px] font-bold bv-muted">
        {label}
      </label>
      <div className="cartoon-box-sm bv-card rounded-2xl flex items-center gap-2 px-3 py-2">
        {icon}
        <input
          id={inputId}
          className="w-full bg-transparent bv-ink text-sm font-semibold outline-none placeholder:opacity-60"
          {...rest}
        />
      </div>
    </div>
  )
}
