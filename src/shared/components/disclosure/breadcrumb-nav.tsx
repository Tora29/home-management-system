'use client'

import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '@chakra-ui/react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

/**
 * パンくずナビゲーションコンポーネント
 */
export function BreadcrumbNav({ items }: BreadcrumbNavProps): React.ReactElement {
  return (
    <BreadcrumbRoot>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        if (isLast) {
          return (
            <BreadcrumbCurrentLink key={index}>
              {item.label}
            </BreadcrumbCurrentLink>
          )
        }

        return (
          <BreadcrumbLink key={index} href={item.href}>
            {item.label}
          </BreadcrumbLink>
        )
      })}
    </BreadcrumbRoot>
  )
}