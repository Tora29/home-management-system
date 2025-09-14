'use client'

import { Presence as ChakraPresence } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface PresenceProps {
  children: ReactNode
  present: boolean
  animateInitial?: boolean
  exitBeforeEnter?: boolean
}

/**
 * プレゼンスコンポーネント
 */
export function Presence({
  children,
  present,
  animateInitial = true,
  exitBeforeEnter = false
}: PresenceProps): React.ReactElement {
  return (
    <ChakraPresence present={present} animateInitial={animateInitial} exitBeforeEnter={exitBeforeEnter}>
      {children}
    </ChakraPresence>
  )
}