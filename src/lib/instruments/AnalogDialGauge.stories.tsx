import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalogDialGauge } from './AnalogDialGauge'

const meta = {
  title: 'Instruments/AnalogDialGauge',
  component: AnalogDialGauge,
  args: {
    label: 'Coolant',
    min: 0,
    max: 100,
    unit: '°C',
    warningStart: 70,
    dangerStart: 90,
    size: 'md',
  },
} satisfies Meta<typeof AnalogDialGauge>
export default meta
type Story = StoryObj<typeof meta>

export const Low: Story = { args: { value: 18 } }
export const Nominal: Story = { args: { value: 52 } }
export const Redline: Story = { args: { value: 96 } }
export const Yellow: Story = { args: { value: 52, variant: 'yellow' } }
export const Large: Story = { args: { value: 52, size: 'lg' } }
