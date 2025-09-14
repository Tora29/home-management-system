export type { Alert } from '@prisma/client'

export type AlertType = 'LOW_STOCK' | 'EXPIRY' | 'OVERSTOCK'

export interface CreateAlertInput {
  itemId: string
  type: AlertType
  thresholdValue?: number
  message?: string
  isEnabled?: boolean
}

export interface UpdateAlertInput {
  type?: AlertType
  thresholdValue?: number
  message?: string
  isEnabled?: boolean
  acknowledgedAt?: Date | null
}

export type AlertWithItem = {
  id: string
  type: string
  isEnabled: boolean
  thresholdValue?: number | null
  message?: string | null
  lastTriggeredAt?: Date | null
  acknowledgedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  itemId: string
  item: {
    id: string
    name: string
    quantity: number
    unit: string
    expiryDate?: Date | null
    minimumStock?: number | null
    category: {
      name: string
    }
  }
}