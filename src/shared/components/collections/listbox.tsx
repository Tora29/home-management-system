'use client'

import { Box, VStack } from '@chakra-ui/react'

interface ListboxOption {
  value: string
  label: string
  disabled?: boolean
}

interface ListboxProps {
  options: ListboxOption[]
  value?: string
  onChange?: (value: string) => void
}

/**
 * リストボックスコンポーネント
 */
export function Listbox({ options, value, onChange }: ListboxProps): React.ReactElement {
  return (
    <VStack align="stretch" spacing={0} borderWidth={1} borderRadius="md" maxH="200px" overflowY="auto">
      {options.map((option) => (
        <Box
          key={option.value}
          p={2}
          cursor={option.disabled ? 'not-allowed' : 'pointer'}
          opacity={option.disabled ? 0.5 : 1}
          bg={value === option.value ? 'blue.50' : 'transparent'}
          _hover={!option.disabled ? { bg: 'gray.50' } : {}}
          onClick={() => !option.disabled && onChange?.(option.value)}
        >
          {option.label}
        </Box>
      ))}
    </VStack>
  )
}