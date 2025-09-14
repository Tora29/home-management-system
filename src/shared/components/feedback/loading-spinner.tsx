'use client'

import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullScreen?: boolean
}

/**
 * ローディングスピナーコンポーネント
 */
export function LoadingSpinner({
  message = '読み込み中...',
  size = 'lg',
  fullScreen = false
}: LoadingSpinnerProps): React.ReactElement {
  const content = (
    <VStack spacing={4}>
      <Spinner size={size} color="blue.500" />
      {message && (
        <Text color="gray.600" fontSize="sm">
          {message}
        </Text>
      )}
    </VStack>
  )

  if (fullScreen) {
    return (
      <Center minH="100vh">
        {content}
      </Center>
    )
  }

  return (
    <Center py={8}>
      {content}
    </Center>
  )
}