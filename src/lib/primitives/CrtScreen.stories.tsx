import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrtScreen } from './CrtScreen'

const meta = {
  title: 'Primitives/CrtScreen',
  component: CrtScreen,
  args: {
    children: <p className="w-64 p-4 font-mono text-sm bv-ink">GRID 60.00 Hz</p>,
  },
} satisfies Meta<typeof CrtScreen>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Glow: Story = { args: { glow: true } }
