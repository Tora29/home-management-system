'use client'

import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@chakra-ui/react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  multiple?: boolean
}

/**
 * セレクトコンポーネント
 */
export function Select({ options, value, onChange, placeholder = '選択してください', multiple = false }: SelectProps): React.ReactElement {
  return (
    <SelectRoot multiple={multiple} value={value} onValueChange={onChange}>
      <SelectLabel>選択</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}