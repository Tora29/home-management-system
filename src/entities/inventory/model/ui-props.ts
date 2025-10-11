/**
 * 在庫管理UIコンポーネントのProps型定義
 */

import type { ItemWithCategory } from '@/features/inventory/model/types'
import type { GridItemProps } from '@chakra-ui/react'
import type { Category, Unit, Location } from '@prisma/client'

/**
 * Pagination コンポーネントのProps
 */
export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  colSpan?: GridItemProps['colSpan']
}

/**
 * SearchBar コンポーネントのProps
 */
export interface SearchBarProps {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
  colSpan?: GridItemProps['colSpan']
}

/**
 * Table コンポーネントのProps
 */
export interface TableProps {
  items: ItemWithCategory[]
  isLoading?: boolean
  colSpan?: GridItemProps['colSpan']
}

/**
 * Filters コンポーネントのProps
 */
export interface FiltersProps {
  categories: Category[]
  locations: Location[]
  selectedCategory: string
  selectedLocation: string
  onCategoryChange: (categoryId: string) => void
  onLocationChange: (locationId: string) => void
  colSpan?: GridItemProps['colSpan']
}

/**
 * ItemFormFields コンポーネントのProps
 */
export interface ItemFormFieldsProps {
  categories: Category[]
  units: Unit[]
  locations: Location[]
  errors?: Record<string, string>
}
