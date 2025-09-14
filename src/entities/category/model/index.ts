export type { Category } from '@prisma/client'

export interface CreateCategoryInput {
  name: string
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
  isActive?: boolean
}

export type CategoryWithItemCount = {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    items: number
  }
}