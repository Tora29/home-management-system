'use client'

import { Portal as ChakraPortal } from '@chakra-ui/react'

interface PortalProps {
  children: React.ReactNode
  container?: HTMLElement
}

/**
 * ポータルコンポーネント
 */
export function Portal({ children, container }: PortalProps): React.ReactElement {
  return (
    <ChakraPortal container={container}>
      {children}
    </ChakraPortal>
  )
}