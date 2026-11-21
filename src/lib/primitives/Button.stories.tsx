import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Dispatch', onClick: fn() },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Dispatch' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}
export const Accent: Story = { args: { variant: 'accent' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Medium: Story = { args: { size: 'md' } }
export const Disabled: Story = { args: { disabled: true } }
