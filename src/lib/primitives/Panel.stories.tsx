import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './Panel'

const meta = { title: 'Primitives/Panel', component: Panel } satisfies Meta<typeof Panel>
export default meta
type Story = StoryObj<typeof meta>

const body = <p className="w-56 p-4 text-sm font-semibold bv-ink">Inked toy panel</p>

export const Card: Story = { args: { tone: 'card', children: body } }
export const Plate: Story = { args: { tone: 'plate', children: body } }
export const PlateAlt: Story = { args: { tone: 'plate-alt', children: body } }
export const Small: Story = { args: { size: 'sm', children: body } }
