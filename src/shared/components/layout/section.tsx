'use client'

import { Box, Heading, Stack } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface SectionProps {
  title?: string
  subtitle?: string
  children: ReactNode
  spacing?: number | string
}

/**
 * セクションコンポーネント
 */
export function Section({
  title,
  subtitle,
  children,
  spacing = 4
}: SectionProps): React.ReactElement {
  return (
    <Box as="section">
      <Stack gap={spacing}>
        {(title || subtitle) && (
          <Box>
            {title && <Heading size="md">{title}</Heading>}
            {subtitle && <Box color="gray.600" fontSize="sm">{subtitle}</Box>}
          </Box>
        )}
        {children}
      </Stack>
    </Box>
  )
}