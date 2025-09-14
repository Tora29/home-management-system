'use client'

import { ProgressBar, ProgressCircleRing, ProgressCircleRoot, ProgressLabel, ProgressRoot, ProgressValueText } from '@chakra-ui/react'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  colorScheme?: string
  showValue?: boolean
}

/**
 * プログレスバーコンポーネント
 */
export function Progress({ value, max = 100, size = 'md', colorScheme = 'blue', showValue = false }: ProgressBarProps): React.ReactElement {
  return (
    <ProgressRoot value={value} max={max} size={size} colorScheme={colorScheme}>
      {showValue && <ProgressLabel>{Math.round((value / max) * 100)}%</ProgressLabel>}
      <ProgressBar />
      {showValue && <ProgressValueText>{value}/{max}</ProgressValueText>}
    </ProgressRoot>
  )
}

interface ProgressCircleProps {
  value: number
  size?: number
  thickness?: number
  colorScheme?: string
  showValue?: boolean
}

/**
 * サークルプログレスコンポーネント
 */
export function ProgressCircle({ value, size = 120, thickness = 10, colorScheme = 'blue', showValue = true }: ProgressCircleProps): React.ReactElement {
  return (
    <ProgressCircleRoot value={value} size={size.toString()} colorScheme={colorScheme}>
      <ProgressCircleRing thickness={thickness} />
      {showValue && <ProgressValueText>{value}%</ProgressValueText>}
    </ProgressCircleRoot>
  )
}