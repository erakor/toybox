import type { Meta, StoryObj } from '@storybook/react-vite'
import { buildInitialHistory } from '../fixtures'
import { EnergyFlowChart } from './EnergyFlowChart'

const history = buildInitialHistory()

const meta = {
  title: 'Charts/EnergyFlowChart',
  component: EnergyFlowChart,
  parameters: { layout: 'padded' },
  args: { history, peakThresholdKw: 480 },
} satisfies Meta<typeof EnergyFlowChart>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const LowThreshold: Story = { args: { peakThresholdKw: 425 } }
export const Tall: Story = { args: { heightClass: 'h-72' } }
