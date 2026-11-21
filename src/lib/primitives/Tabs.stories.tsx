import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Tabs } from './Tabs'

const items = [
  { value: 'power', label: 'Power' },
  { value: 'machines', label: 'Machines' },
  { value: 'alerts', label: 'Alerts' },
]

function Demo() {
  const [value, setValue] = useState('power')
  return <Tabs items={items} value={value} onChange={setValue} aria-label="Sections" />
}

const meta = { title: 'Primitives/Tabs', component: Tabs, render: () => <Demo /> } satisfies Meta<
  typeof Tabs
>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { items, value: 'power', onChange: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('tab', { name: 'Power' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Machines' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('tab', { name: 'Alerts' })).toHaveFocus()
  },
}
