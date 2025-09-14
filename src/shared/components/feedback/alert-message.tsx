'use client'

import { Alert } from '@chakra-ui/react'

interface AlertMessageProps {
  title: string
  description?: string
  status?: 'info' | 'warning' | 'success' | 'error'
  icon?: string
}

/**
 * アラートメッセージコンポーネント
 */
export function AlertMessage({
  title,
  description,
  status = 'info',
  icon
}: AlertMessageProps): React.ReactElement {
  return (
    <Alert.Root status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>
          {icon && `${icon} `}
          {title}
        </Alert.Title>
        {description && (
          <Alert.Description>{description}</Alert.Description>
        )}
      </Alert.Content>
    </Alert.Root>
  )
}