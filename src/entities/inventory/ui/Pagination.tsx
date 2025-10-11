'use client'

import {
  ButtonGroup,
  IconButton,
  GridItem,
  HStack,
  Pagination as ChakraPagination,
} from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import type { PaginationProps } from '../model'

/**
 * ページネーションコンポーネント
 *
 * @returns ページネーションUI
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  colSpan,
}: PaginationProps): React.ReactElement {
  return (
    <GridItem colSpan={colSpan || 12}>
      <HStack justify="center">
        <ChakraPagination.Root
          count={totalItems}
          pageSize={pageSize}
          page={currentPage}
          onPageChange={(e) => onPageChange((e as { page: number }).page)}
        >
          <ButtonGroup variant="ghost" size="sm">
            <ChakraPagination.PrevTrigger asChild>
              <IconButton aria-label="前のページ">
                <LuChevronLeft />
              </IconButton>
            </ChakraPagination.PrevTrigger>

            <ChakraPagination.Items
              render={(page) => (
                <IconButton
                  variant={{ base: 'ghost', _selected: 'outline' }}
                  aria-label={`ページ ${(page as { value: number }).value}`}
                >
                  {(page as { value: number }).value}
                </IconButton>
              )}
            />

            <ChakraPagination.NextTrigger asChild>
              <IconButton aria-label="次のページ">
                <LuChevronRight />
              </IconButton>
            </ChakraPagination.NextTrigger>
          </ButtonGroup>
        </ChakraPagination.Root>
      </HStack>
    </GridItem>
  )
}
