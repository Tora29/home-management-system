'use client'

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface AccordionItem {
  title: string
  content: ReactNode
  value: string
}

interface AccordionSectionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultValue?: string[]
}

/**
 * アコーディオンセクションコンポーネント
 */
export function AccordionSection({
  items,
  allowMultiple = false,
  defaultValue = []
}: AccordionSectionProps): React.ReactElement {
  return (
    <AccordionRoot multiple={allowMultiple} defaultValue={defaultValue}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
          <AccordionItemContent>{item.content}</AccordionItemContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}