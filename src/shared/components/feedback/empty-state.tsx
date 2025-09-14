'use client'

import { Button, Center, Stack, Text, Card } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string | ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

/**
 * 空状態表示コンポーネント（Chakra UI Feedback カテゴリ）
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps): React.ReactElement {
  return (
    <Card.Root>
      <Card.Body>
        <Center py={12}>
          <Stack gap={4} align="center">
            {icon && (
              typeof icon === 'string' ? (
                <Text fontSize="4xl">{icon}</Text>
              ) : (
                <>{icon}</>
              )
            )}
            <Text color="gray.600" fontSize="lg">
              {title}
            </Text>
            {description && (
              <Text color="gray.500" fontSize="sm" textAlign="center">
                {description}
              </Text>
            )}
            {action && (
              <Button
                asChild={!!action.href}
                colorScheme="blue"
                size="sm"
                onClick={action.onClick}
              >
                {action.href ? (
                  <a href={action.href}>{action.label}</a>
                ) : (
                  action.label
                )}
              </Button>
            )}
          </Stack>
        </Center>
      </Card.Body>
    </Card.Root>
  )
}