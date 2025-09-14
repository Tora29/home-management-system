'use client'

import { LinkBox, LinkOverlay as ChakraLinkOverlay } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface LinkOverlayProps {
  children: ReactNode
  href: string
  isExternal?: boolean
  overlayContent: ReactNode
}

/**
 * リンクオーバーレイコンポーネント
 */
export function LinkOverlay({
  children,
  href,
  isExternal = false,
  overlayContent
}: LinkOverlayProps): React.ReactElement {
  return (
    <LinkBox>
      {children}
      <ChakraLinkOverlay href={href} isExternal={isExternal}>
        {overlayContent}
      </ChakraLinkOverlay>
    </LinkBox>
  )
}