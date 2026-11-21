import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = { title: 'Primitives/Badge', component: Badge } satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Ok: Story = { args: { tone: 'ok', children: 'Optimal' } }
export const Warn: Story = { args: { tone: 'warn', children: 'Warning' } }
export const Danger: Story = { args: { tone: 'danger', children: 'Critical' } }
export const Info: Story = { args: { tone: 'info', children: 'Advisory' } }
export const Neutral: Story = { args: { tone: 'neutral', children: 'Standby' } }
