import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { TextField } from './TextField'

const meta = {
  title: 'Primitives/TextField',
  component: TextField,
  args: { label: 'Search machines', placeholder: 'PS-01' },
} satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithIcon: Story = { args: { icon: <Search size={14} aria-hidden="true" /> } }
export const Filled: Story = { args: { defaultValue: 'Cooling loop' } }
