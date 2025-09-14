'use client'

import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react'

interface SelectOption {
  value: string
  label: string
  icon?: string
}

interface SelectFieldProps {
  name: string
  options: SelectOption[]
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
}

/**
 * セレクトフィールドコンポーネント
 */
export function SelectField({
  name,
  options,
  placeholder = '選択してください',
  value,
  onChange,
  required = false
}: SelectFieldProps): React.ReactElement {
  return (
    <NativeSelectRoot>
      <NativeSelectField
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon && `${option.icon} `}
            {option.label}
          </option>
        ))}
      </NativeSelectField>
    </NativeSelectRoot>
  )
}