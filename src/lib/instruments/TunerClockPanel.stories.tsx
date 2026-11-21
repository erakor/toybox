import type { Meta, StoryObj } from '@storybook/react-vite'
import { TunerClockPanel } from './TunerClockPanel'

const meta = {
  title: 'Instruments/TunerClockPanel',
  component: TunerClockPanel,
  args: {
    shiftElapsedSec: 5420,
    peakThresholdKw: 480,
    onChangePeakThreshold: () => {},
    harmonicTrim: 50,
    onChangeHarmonicTrim: () => {},
    surgeActive: false,
    criticalCount: 0,
    bayLightsOn: true,
  },
} satisfies Meta<typeof TunerClockPanel>
export default meta
type Story = StoryObj<typeof meta>

export const Calm: Story = {}
export const Surge: Story = { args: { surgeActive: true, criticalCount: 2 } }
export const LightsOff: Story = { args: { bayLightsOn: false } }
