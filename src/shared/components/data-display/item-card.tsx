'use client'

import { Button, Box, Text, Badge, Card, Flex, Stack, HStack, Heading } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ItemCardProps {
  title: string
  badge?: {
    label: string
    colorScheme?: string
    icon?: string
  }
  status?: {
    value: string | number
    unit?: string
    colorScheme?: string
  }
  details?: Array<{
    label: string
    value: string | ReactNode
    icon?: string
  }>
  footer?: {
    leftContent?: ReactNode
    actions?: Array<{
      label: string
      onClick?: () => void
      colorScheme?: string
      variant?: string
    }>
  }
  children?: ReactNode
}

/**
 * アイテムカードコンポーネント
 */
export function ItemCard({
  title,
  badge,
  status,
  details,
  footer,
  children
}: ItemCardProps): React.ReactElement {
  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Stack gap={3} align="stretch">
          <HStack justify="space-between" align="start">
            <Box flex={1}>
              <Heading size="sm" mb={1}>
                {title}
              </Heading>
              {badge && (
                <HStack gap={2} flexWrap="wrap">
                  <Badge colorScheme={badge.colorScheme || 'teal'} variant="subtle">
                    {badge.icon && `${badge.icon} `}
                    {badge.label}
                  </Badge>
                </HStack>
              )}
            </Box>
            {status && (
              <Badge
                colorScheme={status.colorScheme || 'green'}
                fontSize="lg"
                px={2}
                py={1}
                borderRadius="md"
              >
                {status.value} {status.unit}
              </Badge>
            )}
          </HStack>

          {details && details.length > 0 && (
            <Stack gap={1} fontSize="sm" color="gray.600">
              {details.map((detail, index) => (
                <HStack key={index}>
                  {detail.icon && <Text>{detail.icon}</Text>}
                  <Text fontWeight="medium">{detail.label}:</Text>
                  {typeof detail.value === 'string' ? (
                    <Text>{detail.value}</Text>
                  ) : (
                    detail.value
                  )}
                </HStack>
              ))}
            </Stack>
          )}

          {children}

          {footer && (
            <Flex justify="space-between" align="center" pt={2} borderTopWidth={1}>
              {footer.leftContent}
              {footer.actions && (
                <HStack gap={2}>
                  {footer.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="xs"
                      variant={action.variant || 'ghost'}
                      colorScheme={action.colorScheme || 'blue'}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </HStack>
              )}
            </Flex>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}