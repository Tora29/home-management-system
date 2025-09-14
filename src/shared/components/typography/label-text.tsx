'use client'

import { HStack, Text } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface LabelTextProps {
  label: string
  value: string | ReactNode
  icon?: string
  color?: string
}

/**
 * ラベル付きテキストコンポーネント
 */
export function LabelText({
  label,
  value,
  icon,
  color = 'gray.600'
}: LabelTextProps): React.ReactElement {
  return (
    <HStack fontSize="sm" color={color}>
      {icon && <Text>{icon}</Text>}
      <Text fontWeight="medium">{label}:</Text>
      {typeof value === 'string' ? <Text>{value}</Text> : value}
    </HStack>
  )
}