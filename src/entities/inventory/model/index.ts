/**
 * エンティティの型定義をエクスポート
 * Zodスキーマはfeaturesの model/validators.ts に移動
 */

// Prismaから直接エクスポート
export type { Item, ItemHistory, Category, Unit, Location } from '@prisma/client'

// UIコンポーネントのProps型定義
export type {
  PaginationProps,
  SearchBarProps,
  TableProps,
  FiltersProps,
  ItemFormFieldsProps,
} from './ui-props'
