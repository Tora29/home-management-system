'use client'

import { Button, Heading, HStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: {
    label: string
    icon?: string
    onClick?: () => void
    href?: string
    colorScheme?: string
  }
  children?: ReactNode
}

export function PageHeader({ title, action, children }: PageHeaderProps): React.ReactElement {
  return (
    <HStack justify="space-between" align="center">
      <Heading size="lg">{title}</Heading>
      {children}
      {action && (
        <Button
          asChild={!!action.href}
          colorScheme={action.colorScheme || 'blue'}
          onClick={action.onClick}
        >
          {action.href ? (
            <a href={action.href}>
              {action.icon && `${action.icon} `}
              {action.label}
            </a>
          ) : (
            <>
              {action.icon && `${action.icon} `}
              {action.label}
            </>
          )}
        </Button>
      )}
    </HStack>
  )
}
