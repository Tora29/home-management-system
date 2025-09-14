'use client'

import { ColorModeButton, useColorMode } from '@chakra-ui/react'

/**
 * カラーモード切り替えボタンコンポーネント
 */
export function ColorModeToggle(): React.ReactElement {
  return <ColorModeButton />
}

/**
 * カラーモードフック
 */
export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? lightValue : darkValue
}