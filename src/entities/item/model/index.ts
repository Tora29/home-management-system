export type { Item, Category, ShoppingListItem, Alert, ItemHistory } from '@prisma/client'

export type ItemWithRelations = {
  id: string
  name: string
  description?: string | null
  quantity: number
  unit: string
  minimumStock?: number | null
  maximumStock?: number | null
  location?: string | null
  expiryDate?: Date | null
  barcode?: string | null
  notes?: string | null
  imageUrl?: string | null
  isActive: boolean
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category: {
    id: string
    name: string
    icon?: string | null
    color?: string | null
  }
}

export type AlertType = 'LOW_STOCK' | 'EXPIRY' | 'OVERSTOCK'

export type ItemAction = 'ADD' | 'REMOVE' | 'UPDATE' | 'ADJUST'

export type Priority = 0 | 1 | 2

export interface CreateItemInput {
  name: string
  categoryId: string
  quantity: number
  unit: string
  description?: string
  minimumStock?: number
  maximumStock?: number
  location?: string
  expiryDate?: Date
  barcode?: string
  notes?: string
  imageUrl?: string
}

export interface UpdateItemInput {
  name?: string
  categoryId?: string
  quantity?: number
  unit?: string
  description?: string
  minimumStock?: number
  maximumStock?: number
  location?: string
  expiryDate?: Date | null
  barcode?: string
  notes?: string
  imageUrl?: string
  isActive?: boolean
}