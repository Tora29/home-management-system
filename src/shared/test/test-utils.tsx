import React from 'react'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { render, type RenderOptions } from '@testing-library/react'

/**
 * テスト用のカスタムラッパー
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - レンダリングするReactの子要素
 * @returns ChakraProviderでラップされたJSX要素
 */
export function AllTheProviders({ children }: { children: React.ReactNode }): React.ReactElement {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
