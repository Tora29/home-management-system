'use client'

import { GridItem, Input, InputGroup } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'

import type { SearchBarProps } from '../model'

/**
 * 在庫検索バーコンポーネント
 *
 * @returns 検索バーUI
 */
export function SearchBar({
  value,
  onSearch,
  placeholder = '商品名、バーコード、備考で検索...',
  colSpan,
}: SearchBarProps): React.ReactElement {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value)
    }
  }

  return (
    <GridItem colSpan={colSpan || { base: 12, md: 6 }}>
      <InputGroup startElement={<LuSearch />}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="subtle"
        />
      </InputGroup>
    </GridItem>
  )
}
