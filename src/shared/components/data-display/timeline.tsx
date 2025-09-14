'use client'

import { TimelineConnector, TimelineContent, TimelineDescription, TimelineIndicator, TimelineItem, TimelineRoot, TimelineTitle } from '@chakra-ui/react'

interface TimelineItemData {
  title: string
  description?: string
  date?: string
  status?: 'completed' | 'current' | 'upcoming'
}

interface TimelineProps {
  items: TimelineItemData[]
  variant?: 'subtle' | 'solid' | 'outline'
}

/**
 * タイムラインコンポーネント
 */
export function Timeline({ items, variant = 'subtle' }: TimelineProps): React.ReactElement {
  return (
    <TimelineRoot variant={variant}>
      {items.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineIndicator
            colorPalette={
              item.status === 'completed' ? 'green' :
              item.status === 'current' ? 'blue' :
              'gray'
            }
          />
          {index < items.length - 1 && <TimelineConnector />}
          <TimelineContent>
            <TimelineTitle>{item.title}</TimelineTitle>
            {item.description && (
              <TimelineDescription>{item.description}</TimelineDescription>
            )}
            {item.date && (
              <TimelineDescription fontSize="xs" color="gray.500">
                {item.date}
              </TimelineDescription>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineRoot>
  )
}