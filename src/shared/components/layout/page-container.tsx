'use client'

import { Container, Stack } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  maxWidth?: string
  py?: number | string
}

/**
 * ページコンテナレイアウトコンポーネント
 */
export function PageContainer({
  children,
  maxWidth = 'container.xl',
  py = 8
}: PageContainerProps): React.ReactElement {
  return (
    <Container maxW={maxWidth} py={py}>
      <Stack gap={8} align="stretch">
        {children}
      </Stack>
    </Container>
  )
}