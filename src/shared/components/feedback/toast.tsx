'use client'

import { useToast } from '@chakra-ui/react'

interface ToastOptions {
  title: string
  description?: string
  status?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  isClosable?: boolean
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
}

/**
 * トースト通知フック
 */
export function useToastNotification() {
  const toast = useToast()

  const showToast = ({
    title,
    description,
    status = 'info',
    duration = 5000,
    isClosable = true,
    position = 'bottom-right'
  }: ToastOptions): void => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position,
    })
  }

  return { showToast }
}