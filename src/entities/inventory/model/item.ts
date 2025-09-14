/**
 *
 */
export type Item = {
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
  categoryId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 *
 */
export type CreateItemInput = {
  name: string
  description?: string
  quantity: number
  unit: string
  minimumStock?: number
  maximumStock?: number
  location?: string
  expiryDate?: string // ISO 8601形式
  barcode?: string
  notes?: string
  categoryId: string
}
