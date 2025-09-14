'use client'

import { Badge } from '@chakra-ui/react'

interface StatusBadgeProps {
  value: string | number
  unit?: string
  threshold?: {
    warning?: number
    error?: number
  }
  colorScheme?: string
  size?: string
}

/**
 * ステータスバッジコンポーネント
 */
export function StatusBadge({
  value,
  unit,
  threshold,
  colorScheme,
  size = 'lg'
}: StatusBadgeProps): React.ReactElement {
  const getColorScheme = (): string => {
    if (colorScheme) {
      return colorScheme
    }

    if (threshold && typeof value === 'number') {
      if (threshold.error !== undefined && value <= threshold.error) {
        return 'red'
      }
      if (threshold.warning !== undefined && value <= threshold.warning) {
        return 'orange'
      }
    }

    return 'green'
  }

  return (
    <Badge
      colorScheme={getColorScheme()}
      fontSize={size}
      px={2}
      py={1}
      borderRadius="md"
    >
      {value} {unit}
    </Badge>
  )
}