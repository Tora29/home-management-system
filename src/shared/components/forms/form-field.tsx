'use client'

import { Field } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  helperText?: string
  errorText?: string
  required?: boolean
  invalid?: boolean
}

/**
 * フォームフィールドコンポーネント
 */
export function FormField({
  label,
  children,
  helperText,
  errorText,
  required = false,
  invalid = false
}: FormFieldProps): React.ReactElement {
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      {children}
      {helperText && !invalid && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
      {invalid && errorText && (
        <Field.ErrorText>{errorText}</Field.ErrorText>
      )}
    </Field.Root>
  )
}