import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BatterySunburstCore } from './BatterySunburstCore'

const meta = {
  title: 'Instruments/BatterySunburstCore',
  component: BatterySunburstCore,
  args: {
    batteryPct: 84,
    totalPowerKw: 424,
    regenKw: 58,
    shiftKwh: 1280,
    surgeActive: false,
    onToggleSurge: fn(),
  },
} satisfies Meta<typeof BatterySunburstCore>
export default meta
type Story = StoryObj<typeof meta>

export const Charged: Story = {}
export const Low: Story = { args: { batteryPct: 12, regenKw: 4 } }
export const Surge: Story = { args: { surgeActive: true, totalPowerKw: 489 } }
