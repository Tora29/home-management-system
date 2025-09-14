'use client'

import { Em as ChakraEm, Heading as ChakraHeading, Highlight as ChakraHighlight, Kbd as ChakraKbd, Link as ChakraLink, Mark as ChakraMark, Prose as ChakraProse, Text as ChakraText } from '@chakra-ui/react'

import type { ReactNode } from 'react'

/**
 * 強調テキストコンポーネント
 */
export function Em({ children }: { children: ReactNode }): React.ReactElement {
  return <ChakraEm>{children}</ChakraEm>
}

/**
 * 見出しコンポーネント
 */
export function Heading({
  children,
  size = 'md',
  as
}: {
  children: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}): React.ReactElement {
  return <ChakraHeading as={as} size={size}>{children}</ChakraHeading>
}

/**
 * ハイライトテキストコンポーネント
 */
export function Highlight({
  children,
  query,
  styles
}: {
  children: string
  query: string | string[]
  styles?: object
}): React.ReactElement {
  return <ChakraHighlight query={query} styles={styles}>{children}</ChakraHighlight>
}

/**
 * キーボードキーコンポーネント
 */
export function Kbd({ children }: { children: ReactNode }): React.ReactElement {
  return <ChakraKbd>{children}</ChakraKbd>
}

/**
 * リンクコンポーネント
 */
export function Link({
  children,
  href,
  isExternal = false
}: {
  children: ReactNode
  href: string
  isExternal?: boolean
}): React.ReactElement {
  return <ChakraLink href={href} isExternal={isExternal}>{children}</ChakraLink>
}

/**
 * マークテキストコンポーネント
 */
export function Mark({ children }: { children: ReactNode }): React.ReactElement {
  return <ChakraMark>{children}</ChakraMark>
}

/**
 * プロースコンポーネント
 */
export function Prose({
  children,
  size = 'md'
}: {
  children: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}): React.ReactElement {
  return <ChakraProse size={size}>{children}</ChakraProse>
}

/**
 * テキストコンポーネント
 */
export function Text({
  children,
  size,
  color,
  fontWeight,
  textAlign
}: {
  children: ReactNode
  size?: string
  color?: string
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
}): React.ReactElement {
  return (
    <ChakraText
      fontSize={size}
      color={color}
      fontWeight={fontWeight}
      textAlign={textAlign}
    >
      {children}
    </ChakraText>
  )
}