import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { ShiftGear } from '../types'
import { CockpitDriveCluster } from './CockpitDriveCluster'

const meta = {
  title: 'Instruments/CockpitDriveCluster',
  component: CockpitDriveCluster,
  args: {
    shiftGear: ShiftGear.Drive,
    onSelectGear: () => {},
    bayLightsOn: true,
    onToggleBayLights: () => {},
    coolantPurgeOn: false,
    onToggleCoolantPurge: () => {},
    shiftUnits: 3120,
    shiftKwh: 1280,
  },
} satisfies Meta<typeof CockpitDriveCluster>
export default meta
type Story = StoryObj<typeof meta>

export const Drive: Story = {}
export const Park: Story = { args: { shiftGear: ShiftGear.Park, bayLightsOn: false } }
export const PurgeOn: Story = { args: { coolantPurgeOn: true } }

export const Interactive: Story = {
  render: (args) => {
    const [gear, setGear] = useState<ShiftGear>(ShiftGear.Drive)
    return <CockpitDriveCluster {...args} shiftGear={gear} onSelectGear={setGear} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reverse = canvas.getByRole('button', { name: /Regen/ })
    await expect(reverse).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(reverse)
    await expect(reverse).toHaveAttribute('aria-pressed', 'true')
  },
}
