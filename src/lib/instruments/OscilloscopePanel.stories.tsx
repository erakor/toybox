import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { INITIAL_MACHINES, buildBreakers } from '../fixtures'
import { OscilloscopePanel } from './OscilloscopePanel'

const breakers = buildBreakers(INITIAL_MACHINES)

const meta = {
  title: 'Instruments/OscilloscopePanel',
  component: OscilloscopePanel,
  args: {
    gridHz: 60,
    busVoltageV: 480,
    harmonicDistortionPct: 2.1,
    tick: 12,
    breakers,
    onToggleBreaker: fn(),
  },
} satisfies Meta<typeof OscilloscopePanel>
export default meta
type Story = StoryObj<typeof meta>

export const Nominal: Story = {}
export const HighDistortion: Story = { args: { harmonicDistortionPct: 7.8, gridHz: 59.7 } }
export const TrippedBreaker: Story = {
  args: { breakers: breakers.map((b, i) => (i === 2 ? { ...b, closed: false, amps: 0 } : b)) },
}
