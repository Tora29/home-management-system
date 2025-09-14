'use client'

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface Tab {
  value: string
  label: string
  content: ReactNode
}

interface TabsPanelProps {
  tabs: Tab[]
  defaultValue?: string
  orientation?: 'horizontal' | 'vertical'
}

/**
 * タブパネルコンポーネント
 */
export function TabsPanel({
  tabs,
  defaultValue,
  orientation = 'horizontal'
}: TabsPanelProps): React.ReactElement {
  return (
    <TabsRoot defaultValue={defaultValue || tabs[0]?.value} orientation={orientation}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  )
}