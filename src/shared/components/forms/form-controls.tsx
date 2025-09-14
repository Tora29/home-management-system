'use client'

import {
  Checkbox as ChakraCheckbox,
  CheckboxCard as ChakraCheckboxCard,
  ColorPicker,
  ColorSwatch as ChakraColorSwatch,
  Editable,
  Fieldset,
  FileUploadDropzone,
  FileUploadRoot,
  FileUploadTrigger,
  Input as ChakraInput,
  NumberInputField,
  NumberInputRoot,
  PasswordInput as ChakraPasswordInput,
  PinInput as ChakraPinInput,
  RadioCard as ChakraRadioCard,
  RadioCardItem,
  RadioGroup,
  RatingGroup,
  SegmentGroup,
  Slider as ChakraSlider,
  Switch as ChakraSwitch,
  Textarea as ChakraTextarea
} from '@chakra-ui/react'

import type { ReactNode } from 'react'

/**
 * チェックボックスコンポーネント
 */
export function Checkbox({ label, checked, onChange }: {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}): React.ReactElement {
  return (
    <ChakraCheckbox checked={checked} onCheckedChange={onChange}>
      {label}
    </ChakraCheckbox>
  )
}

/**
 * チェックボックスカードコンポーネント
 */
export function CheckboxCard({ children, value }: {
  children: ReactNode
  value: string
}): React.ReactElement {
  return (
    <ChakraCheckboxCard value={value}>
      {children}
    </ChakraCheckboxCard>
  )
}

/**
 * カラーピッカーコンポーネント
 */
export function ColorPickerField({ value, onChange }: {
  value?: string
  onChange?: (value: string) => void
}): React.ReactElement {
  return (
    <ColorPicker.Root value={value} onValueChange={onChange}>
      <ColorPicker.Label>色を選択</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.ChannelInput channel="hex" />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <ColorPicker.Positioner>
        <ColorPicker.Content>
          <ColorPicker.Area>
            <ColorPicker.AreaBackground />
            <ColorPicker.AreaThumb />
          </ColorPicker.Area>
          <ColorPicker.ChannelSlider channel="hue">
            <ColorPicker.ChannelSliderTrack />
            <ColorPicker.ChannelSliderThumb />
          </ColorPicker.ChannelSlider>
        </ColorPicker.Content>
      </ColorPicker.Positioner>
    </ColorPicker.Root>
  )
}

/**
 * カラースウォッチコンポーネント
 */
export function ColorSwatch({ value }: { value: string }): React.ReactElement {
  return <ChakraColorSwatch value={value} />
}

/**
 * 編集可能フィールドコンポーネント
 */
export function EditableField({ defaultValue, placeholder, onSubmit }: {
  defaultValue?: string
  placeholder?: string
  onSubmit?: (value: string) => void
}): React.ReactElement {
  return (
    <Editable.Root defaultValue={defaultValue} placeholder={placeholder} onValueCommit={onSubmit}>
      <Editable.Preview />
      <Editable.Input />
      <Editable.Control>
        <Editable.EditTrigger />
        <Editable.CancelTrigger />
        <Editable.SubmitTrigger />
      </Editable.Control>
    </Editable.Root>
  )
}

/**
 * フィールドセットコンポーネント
 */
export function FieldsetComponent({ legend, children }: {
  legend: string
  children: ReactNode
}): React.ReactElement {
  return (
    <Fieldset.Root>
      <Fieldset.Legend>{legend}</Fieldset.Legend>
      <Fieldset.Content>{children}</Fieldset.Content>
    </Fieldset.Root>
  )
}

/**
 * ファイルアップロードコンポーネント
 */
export function FileUpload({ accept, multiple = false, onFileChange }: {
  accept?: string
  multiple?: boolean
  onFileChange?: (files: File[]) => void
}): React.ReactElement {
  return (
    <FileUploadRoot accept={accept} multiple={multiple} onFileChange={onFileChange}>
      <FileUploadTrigger asChild>
        <button>ファイルを選択</button>
      </FileUploadTrigger>
      <FileUploadDropzone>
        ここにファイルをドラッグ＆ドロップ
      </FileUploadDropzone>
    </FileUploadRoot>
  )
}

/**
 * インプットコンポーネント
 */
export function Input({ type = 'text', placeholder, value, onChange }: {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}): React.ReactElement {
  return <ChakraInput type={type} placeholder={placeholder} value={value} onChange={onChange} />
}

/**
 * 数値入力コンポーネント
 */
export function NumberInput({ min, max, value, onChange }: {
  min?: number
  max?: number
  value?: number
  onChange?: (value: number) => void
}): React.ReactElement {
  return (
    <NumberInputRoot min={min} max={max} value={value} onValueChange={onChange}>
      <NumberInputField />
      <NumberInputRoot.Control>
        <NumberInputRoot.IncrementTrigger />
        <NumberInputRoot.DecrementTrigger />
      </NumberInputRoot.Control>
    </NumberInputRoot>
  )
}

/**
 * パスワード入力コンポーネント
 */
export function PasswordInput({ placeholder, value, onChange }: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}): React.ReactElement {
  return <ChakraPasswordInput placeholder={placeholder} value={value} onChange={onChange} />
}

/**
 * PIN入力コンポーネント
 */
export function PinInput({ length = 4, onChange }: {
  length?: number
  onChange?: (value: string) => void
}): React.ReactElement {
  return (
    <ChakraPinInput.Root onValueComplete={onChange}>
      <ChakraPinInput.Control>
        {Array.from({ length }).map((_, index) => (
          <ChakraPinInput.Input key={index} index={index} />
        ))}
      </ChakraPinInput.Control>
    </ChakraPinInput.Root>
  )
}

/**
 * ラジオカードコンポーネント
 */
export function RadioCard({ options, value, onChange }: {
  options: Array<{ value: string; label: string; description?: string }>
  value?: string
  onChange?: (value: string) => void
}): React.ReactElement {
  return (
    <ChakraRadioCard.Root value={value} onValueChange={onChange}>
      {options.map((option) => (
        <RadioCardItem
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
        />
      ))}
    </ChakraRadioCard.Root>
  )
}

/**
 * ラジオグループコンポーネント
 */
export function Radio({ options, value, onChange }: {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
}): React.ReactElement {
  return (
    <RadioGroup.Root value={value} onValueChange={onChange}>
      {options.map((option) => (
        <RadioGroup.Item key={option.value} value={option.value}>
          <RadioGroup.ItemControl />
          <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

/**
 * レーティングコンポーネント
 */
export function Rating({ max = 5, value, onChange }: {
  max?: number
  value?: number
  onChange?: (value: number) => void
}): React.ReactElement {
  return (
    <RatingGroup.Root max={max} value={value} onValueChange={onChange}>
      <RatingGroup.Control>
        {Array.from({ length: max }).map((_, index) => (
          <RatingGroup.Item key={index} index={index + 1}>
            <RatingGroup.ItemIndicator>⭐</RatingGroup.ItemIndicator>
          </RatingGroup.Item>
        ))}
      </RatingGroup.Control>
    </RatingGroup.Root>
  )
}

/**
 * セグメントコントロールコンポーネント
 */
export function SegmentedControl({ options, value, onChange }: {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
}): React.ReactElement {
  return (
    <SegmentGroup.Root value={value} onValueChange={onChange}>
      {options.map((option) => (
        <SegmentGroup.Item key={option.value} value={option.value}>
          <SegmentGroup.ItemText>{option.label}</SegmentGroup.ItemText>
        </SegmentGroup.Item>
      ))}
      <SegmentGroup.Indicator />
    </SegmentGroup.Root>
  )
}

/**
 * スイッチコンポーネント
 */
export function Switch({ checked, onChange }: {
  checked?: boolean
  onChange?: (checked: boolean) => void
}): React.ReactElement {
  return <ChakraSwitch checked={checked} onCheckedChange={onChange} />
}

/**
 * スライダーコンポーネント
 */
export function Slider({ min = 0, max = 100, value, onChange }: {
  min?: number
  max?: number
  value?: number[]
  onChange?: (value: number[]) => void
}): React.ReactElement {
  return (
    <ChakraSlider.Root min={min} max={max} value={value} onValueChange={onChange}>
      <ChakraSlider.Track>
        <ChakraSlider.FilledTrack />
      </ChakraSlider.Track>
      <ChakraSlider.Thumb index={0} />
    </ChakraSlider.Root>
  )
}

/**
 * テキストエリアコンポーネント
 */
export function Textarea({ placeholder, value, onChange, rows = 3 }: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}): React.ReactElement {
  return <ChakraTextarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} />
}