import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { INITIAL_MACHINES } from '../fixtures'
import { HopperCrewPanel } from './HopperCrewPanel'

const meta = {
  title: 'Instruments/HopperCrewPanel',
  component: HopperCrewPanel,
  args: {
    machines: INITIAL_MACHINES,
    hopperPct: 46,
    completedBatches: 12,
    onTipHopperBatch: fn(),
    bayLightsOn: true,
  },
} satisfies Meta<typeof HopperCrewPanel>
export default meta
type Story = StoryObj<typeof meta>

export const Filling: Story = {}
export const Full: Story = { args: { hopperPct: 100 } }
export const Empty: Story = { args: { hopperPct: 0, completedBatches: 0 } }
