'use client'

import { HStack, Text } from '@chakra-ui/react'

interface DateDisplayProps {
  date: Date | string
  label?: string
  icon?: string
  warningDays?: number
  errorDays?: number
}

/**
 * 日付表示コンポーネント（期限警告付き）
 */
export function DateDisplay({
  date,
  label = '期限',
  icon = '📅',
  warningDays = 7,
  errorDays = 0,
}: DateDisplayProps): React.ReactElement {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const daysUntil = Math.floor((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const getColor = (): string => {
    if (daysUntil < errorDays) return 'red.500'
    if (daysUntil < warningDays) return 'orange.500'
    return 'gray.600'
  }

  return (
    <HStack>
      {icon && <Text>{icon}</Text>}
      <Text fontWeight="medium">{label}:</Text>
      <Text color={getColor()}>
        {dateObj.toLocaleDateString('ja-JP')}
      </Text>
    </HStack>
  )
}