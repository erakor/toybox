import { useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface TabItem<T extends string = string> {
  value: T
  label: ReactNode
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
  className?: string
}

/** Tab list with roving focus: arrow keys, Home and End move and select. */
export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  className = '',
  ...rest
}: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1
    let next = index
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return
    e.preventDefault()
    refs.current[next]?.focus()
    onChange(items[next].value)
  }

  return (
    <div role="tablist" aria-label={rest['aria-label']} className={`flex gap-2 ${className}`}>
      {items.map((item, i) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="cartoon-btn rounded-2xl px-4 py-2 text-xs font-bold cursor-pointer"
            style={
              selected
                ? { backgroundColor: 'var(--bv-accent)', color: 'var(--bv-accent-text)' }
                : { backgroundColor: 'var(--bv-card)', color: 'var(--bv-ink)' }
            }
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
