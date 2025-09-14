'use client'

import { SkipNavContent, SkipNavLink } from '@chakra-ui/react'

interface SkipNavProps {
  contentId?: string
  children?: string
}

/**
 * スキップナビゲーションリンクコンポーネント
 */
export function SkipNav({ contentId = 'main-content', children = 'メインコンテンツへスキップ' }: SkipNavProps): React.ReactElement {
  return <SkipNavLink href={`#${contentId}`}>{children}</SkipNavLink>
}

/**
 * スキップナビゲーションコンテンツコンポーネント
 */
export function SkipNavContentWrapper({ id = 'main-content' }: { id?: string }): React.ReactElement {
  return <SkipNavContent id={id} />
}