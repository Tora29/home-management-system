'use client'

import { Button, IconButton, MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@chakra-ui/react'

interface MenuAction {
  label: string
  onClick: () => void
  icon?: string
  colorScheme?: string
}

interface ActionMenuProps {
  actions: MenuAction[]
  triggerLabel?: string
  triggerIcon?: string
  iconOnly?: boolean
}

/**
 * アクションメニューコンポーネント
 */
export function ActionMenu({
  actions,
  triggerLabel = 'メニュー',
  triggerIcon = '⋮',
  iconOnly = false
}: ActionMenuProps): React.ReactElement {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        {iconOnly ? (
          <IconButton aria-label={triggerLabel} variant="ghost" size="sm">
            {triggerIcon}
          </IconButton>
        ) : (
          <Button variant="ghost" size="sm">
            {triggerIcon && `${triggerIcon} `}
            {triggerLabel}
          </Button>
        )}
      </MenuTrigger>
      <MenuContent>
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            value={action.label}
            onClick={action.onClick}
            color={action.colorScheme ? `${action.colorScheme}.500` : undefined}
          >
            {action.icon && `${action.icon} `}
            {action.label}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  )
}