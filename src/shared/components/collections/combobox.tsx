'use client'

import { Input } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

/**
 * コンボボックスコンポーネント
 */
export function Combobox({ options, value, onChange, placeholder }: ComboboxProps): React.ReactElement {
  return (
    <div>
      <Input
        list="combobox-options"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      <datalist id="combobox-options">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </div>
  )
}