import type { Meta, StoryObj } from '@storybook/react-vite'
import { INITIAL_MACHINES } from '../fixtures'
import { MachineStatus } from '../types'
import { SilhouetteScanner } from './SilhouetteScanner'

const meta = {
  title: 'Instruments/SilhouetteScanner',
  component: SilhouetteScanner,
  args: { machine: INITIAL_MACHINES[0] },
} satisfies Meta<typeof SilhouetteScanner>
export default meta
type Story = StoryObj<typeof meta>

export const Optimal: Story = {}
export const Warning: Story = {
  args: { machine: { ...INITIAL_MACHINES[2], status: MachineStatus.Warning } },
}
export const Critical: Story = {
  args: { machine: { ...INITIAL_MACHINES[0], status: MachineStatus.Critical, temperatureC: 94 } },
}
export const Standby: Story = {
  args: { machine: { ...INITIAL_MACHINES[0], status: MachineStatus.Standby, active: false } },
}
