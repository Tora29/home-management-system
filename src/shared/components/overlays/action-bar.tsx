'use client'

import { ActionBarContent, ActionBarRoot, ActionBarSelectionTrigger, ActionBarSeparator } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ActionBarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  selectionTrigger?: ReactNode
}

/**
 * アクションバーコンポーネント
 */
export function ActionBar({ open, onOpenChange, children, selectionTrigger }: ActionBarProps): React.ReactElement {
  return (
    <ActionBarRoot open={open} onOpenChange={onOpenChange}>
      {selectionTrigger && <ActionBarSelectionTrigger>{selectionTrigger}</ActionBarSelectionTrigger>}
      <ActionBarContent>
        {children}
      </ActionBarContent>
    </ActionBarRoot>
  )
}

export { ActionBarSeparator }