import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { INITIAL_DISPATCHES, INITIAL_MACHINES } from '../fixtures'
import { IntercomDispatchPanel } from './IntercomDispatchPanel'

const meta = {
  title: 'Instruments/IntercomDispatchPanel',
  component: IntercomDispatchPanel,
  args: {
    machines: INITIAL_MACHINES,
    dispatchLogs: INITIAL_DISPATCHES,
    onSendDispatch: fn(),
  },
} satisfies Meta<typeof IntercomDispatchPanel>
export default meta
type Story = StoryObj<typeof meta>

export const WithHistory: Story = {}
export const EmptyLog: Story = { args: { dispatchLogs: [] } }

export const SendDispatch: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const sendButton = canvas.getAllByRole('button').at(-1)!
    await userEvent.click(sendButton)
    await expect(args.onSendDispatch).toHaveBeenCalled()
  },
}
