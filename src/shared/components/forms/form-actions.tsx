'use client'

import { Button, HStack } from '@chakra-ui/react'

interface FormActionsProps {
  primaryLabel?: string
  primaryLoadingText?: string
  secondaryLabel?: string
  isLoading?: boolean
  onSecondaryClick?: () => void
}

/**
 * フォームアクションボタングループ
 */
export function FormActions({
  primaryLabel = '送信',
  primaryLoadingText = '送信中...',
  secondaryLabel = 'キャンセル',
  isLoading = false,
  onSecondaryClick,
}: FormActionsProps): React.ReactElement {
  return (
    <HStack gap={4} pt={4}>
      <Button
        type="submit"
        colorScheme="blue"
        size="lg"
        flex={1}
        loading={isLoading}
        loadingText={primaryLoadingText}
      >
        {primaryLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        flex={1}
        onClick={onSecondaryClick}
        disabled={isLoading}
      >
        {secondaryLabel}
      </Button>
    </HStack>
  )
}