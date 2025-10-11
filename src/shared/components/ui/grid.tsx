import {
  Grid as ChakraGrid,
  GridItem as ChakraGridItem,
  type GridProps as ChakraGridProps,
} from '@chakra-ui/react'

import type { ReactElement } from 'react'

type GridProps = ChakraGridProps

/**
 * 12カラムグリッドシステム
 * デフォルトで12カラム、gap=4に設定
 */
export function Grid({
  gap = 4,
  templateColumns = 'repeat(12, 1fr)',
  ...props
}: GridProps): ReactElement {
  return <ChakraGrid templateColumns={templateColumns} gap={gap} {...props} />
}

type GridItemProps = ChakraGridProps & {
  /**
   * グリッドのカラム数 (1-12) または レスポンシブ対応
   */
  colSpan?: number | { base?: number; sm?: number; md?: number; lg?: number }
}

/**
 * グリッドアイテム
 * colSpan でカラム数を指定
 */
export function GridItem(props: GridItemProps): ReactElement {
  return <ChakraGridItem {...props} />
}
