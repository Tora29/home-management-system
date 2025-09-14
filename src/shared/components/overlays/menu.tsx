'use client'

import { MenuContent, MenuContextTrigger, MenuItem, MenuItemGroup, MenuRoot, MenuSeparator, MenuTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface MenuItemType {
  label: string
  value?: string
  onClick?: () => void
  icon?: string
  isDisabled?: boolean
}

interface MenuProps {
  trigger: ReactNode
  items: MenuItemType[]
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * メニューコンポーネント
 */
export function Menu({ trigger, items, placement = 'bottom' }: MenuProps): React.ReactElement {
  return (
    <MenuRoot positioning={{ placement }}>
      <MenuTrigger asChild>{trigger}</MenuTrigger>
      <MenuContent>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            value={item.value || item.label}
            onClick={item.onClick}
            disabled={item.isDisabled}
          >
            {item.icon && `${item.icon} `}
            {item.label}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  )
}

export { MenuSeparator, MenuItemGroup, MenuContextTrigger }