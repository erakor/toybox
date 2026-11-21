import type { Meta, StoryObj } from '@storybook/react-vite'
import { Zap } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

const meta = { title: 'Primitives/Card', component: Card } satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

const body = <p className="w-80 p-4 text-sm bv-ink">Fleet output is steady.</p>

export const WithTitle: Story = { args: { title: 'Power output', children: body } }
export const WithIconAndActions: Story = {
  args: {
    title: 'Power output',
    icon: <Zap size={16} aria-hidden="true" />,
    actions: <Button>Export</Button>,
    children: body,
  },
}
export const Headerless: Story = { args: { children: body } }
