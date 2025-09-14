export type { ItemHistory } from '@prisma/client'

/**
 *
 */
export type ItemAction = 'ADD' | 'REMOVE' | 'UPDATE' | 'ADJUST'

/**
 *
 */
export interface CreateItemHistoryInput {
  itemId: string
  action: ItemAction
  quantity: number
  unit: string
  beforeValue?: number
  afterValue: number
  reason?: string
  notes?: string
}

/**
 *
 */
export type ItemHistoryWithItem = {
  id: string
  action: string
  quantity: number
  unit: string
  reason?: string | null
  notes?: string | null
  beforeValue?: number | null
  afterValue: number
  createdAt: Date
  itemId: string
  item: {
    id: string
    name: string
    category: {
      name: string
    }
  }
}