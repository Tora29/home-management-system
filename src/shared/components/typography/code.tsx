'use client'

import { Code as ChakraCode, CodeBlock } from '@chakra-ui/react'

interface CodeProps {
  children: string
  colorScheme?: string
}

/**
 * インラインコードコンポーネント
 */
export function Code({ children, colorScheme = 'gray' }: CodeProps): React.ReactElement {
  return <ChakraCode colorScheme={colorScheme}>{children}</ChakraCode>
}

interface CodeBlockProps {
  children: string
  language?: string
  showLineNumbers?: boolean
}

/**
 * コードブロックコンポーネント
 */
export function CodeBlockComponent({ children, language, showLineNumbers = false }: CodeBlockProps): React.ReactElement {
  return (
    <CodeBlock lang={language} showLineNumbers={showLineNumbers}>
      {children}
    </CodeBlock>
  )
}