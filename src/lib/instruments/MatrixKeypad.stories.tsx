import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { PowerPreset } from '../types'
import { MatrixKeypad } from './MatrixKeypad'

const meta = {
  title: 'Instruments/MatrixKeypad',
  component: MatrixKeypad,
  args: {
    activePreset: PowerPreset.NominalRun,
    onSelectPreset: () => {},
    loadBias: 50,
    onChangeLoadBias: () => {},
  },
} satisfies Meta<typeof MatrixKeypad>
export default meta
type Story = StoryObj<typeof meta>

export const Nominal: Story = {}
export const PeakBoost: Story = { args: { activePreset: PowerPreset.PeakBoost, loadBias: 90 } }
export const LoadShed: Story = { args: { activePreset: PowerPreset.LoadShed, loadBias: 10 } }

export const SelectPreset: Story = {
  render: (args) => {
    const [preset, setPreset] = useState<PowerPreset>(PowerPreset.NominalRun)
    return <MatrixKeypad {...args} activePreset={preset} onSelectPreset={setPreset} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /PEAK/ }))
    await expect(canvas.getByRole('button', { name: /PEAK/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}
