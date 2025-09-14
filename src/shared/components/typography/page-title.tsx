'use client'

import { Heading, Text, VStack } from '@chakra-ui/react'

interface PageTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

/**
 * ページタイトルコンポーネント
 */
export function PageTitle({
  title,
  subtitle,
  align = 'left'
}: PageTitleProps): React.ReactElement {
  return (
    <VStack align={align === 'center' ? 'center' : `flex-${align}`} spacing={2}>
      <Heading size="2xl">{title}</Heading>
      {subtitle && (
        <Text color="gray.600" fontSize="lg">
          {subtitle}
        </Text>
      )}
    </VStack>
  )
}