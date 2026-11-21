import { useToyboxTheme } from './theme/ThemeProvider'
import { TOYBOX_THEMES, ToyboxThemeId, type ToyboxThemeConfig } from './theme/themes'

export { ToyboxThemeProvider, useToyboxTheme } from './theme/ThemeProvider'
export { TOYBOX_THEMES, ToyboxThemeId, type ToyboxThemeConfig } from './theme/themes'

/** @deprecated Use `useToyboxTheme`. */
export const useStationTheme = useToyboxTheme
/** @deprecated Use `ToyboxThemeId`. */
export const StationThemeId = ToyboxThemeId
/** @deprecated Use `ToyboxThemeId`. */
export type StationThemeId = ToyboxThemeId
/** @deprecated Use `TOYBOX_THEMES`. */
export const STATION_THEMES = TOYBOX_THEMES
/** @deprecated Use `ToyboxThemeConfig`. */
export type StationThemeConfig = ToyboxThemeConfig

export { Panel, type PanelProps } from './primitives/Panel'
export { Card, CardHeader, type CardProps, type CardHeaderProps } from './primitives/Card'
export { Button, type ButtonProps } from './primitives/Button'
export { CrtScreen, type CrtScreenProps } from './primitives/CrtScreen'
export { Badge, type BadgeProps } from './primitives/Badge'
export { TextField, type TextFieldProps } from './primitives/TextField'
export { Tabs, type TabsProps, type TabItem } from './primitives/Tabs'
export { Sticker, type StickerProps } from './primitives/Sticker'

export { AnalogDialGauge } from './instruments/AnalogDialGauge'
export { BatterySunburstCore } from './instruments/BatterySunburstCore'
export { CockpitDriveCluster } from './instruments/CockpitDriveCluster'
export { HopperCrewPanel } from './instruments/HopperCrewPanel'
export { IntercomDispatchPanel } from './instruments/IntercomDispatchPanel'
export { MatrixKeypad } from './instruments/MatrixKeypad'
export { OscilloscopePanel } from './instruments/OscilloscopePanel'
export { SilhouetteScanner } from './instruments/SilhouetteScanner'
export { TunerClockPanel } from './instruments/TunerClockPanel'
export { EnergyFlowChart } from './charts/EnergyFlowChart'

export * from './types'
export {
  INITIAL_ALERTS,
  INITIAL_DISPATCHES,
  INITIAL_MACHINES,
  buildInitialHistory,
  clamp,
  formatClock,
} from './fixtures'
