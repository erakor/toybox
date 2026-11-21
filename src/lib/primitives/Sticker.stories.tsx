import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './Panel'
import { Sticker } from './Sticker'

const meta = {
  title: 'Primitives/Sticker',
  component: Sticker,
  args: {
    children: (
      <Panel tone="plate" className="w-56 p-4 text-sm font-bold bv-ink">
        Tilts in Cream-Halo
      </Panel>
    ),
  },
} satisfies Meta<typeof Sticker>
export default meta
type Story = StoryObj<typeof meta>

export const Left: Story = { args: { tilt: 'left' } }
export const Right: Story = { args: { tilt: 'right' } }
export const None: Story = { args: { tilt: 'none' } }
