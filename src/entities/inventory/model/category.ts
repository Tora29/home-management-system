/**
 *
 */
export type Category = {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  sortOrder: number
  isActive: boolean
}
