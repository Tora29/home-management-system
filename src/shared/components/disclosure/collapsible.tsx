'use client'

import { Button, CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '@chakra-ui/react'

interface CollapsibleProps {
  trigger: string
  children: React.ReactNode
  defaultOpen?: boolean
}

/**
 * 折りたたみ可能コンポーネント
 */
export function Collapsible({ trigger, children, defaultOpen = false }: CollapsibleProps): React.ReactElement {
  return (
    <CollapsibleRoot defaultOpen={defaultOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          {trigger}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </CollapsibleRoot>
  )
}