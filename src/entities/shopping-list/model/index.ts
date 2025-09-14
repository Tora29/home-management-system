export type { ShoppingListItem } from '@prisma/client'

/**
 *
 */
export interface CreateShoppingListItemInput {
  name: string
  quantity: number
  unit: string
  priority?: number
  notes?: string
  itemId?: string
}

/**
 *
 */
export interface UpdateShoppingListItemInput {
  name?: string
  quantity?: number
  unit?: string
  priority?: number
  notes?: string
  isChecked?: boolean
}

/**
 *
 */
export type ShoppingListItemWithItem = {
  id: string
  name: string
  quantity: number
  unit: string
  priority: number
  notes?: string | null
  isChecked: boolean
  checkedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  itemId?: string | null
  item?: {
    id: string
    name: string
    categoryId: string
    category: {
      name: string
      color?: string | null
    }
  } | null
}