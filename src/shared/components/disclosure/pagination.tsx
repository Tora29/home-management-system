'use client'

import { PaginationEllipsis, PaginationItem, PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot } from '@chakra-ui/react'

interface PaginationProps {
  count: number
  pageSize?: number
  page?: number
  onPageChange?: (page: number) => void
  siblingCount?: number
}

/**
 * ページネーションコンポーネント
 */
export function Pagination({ count, pageSize = 10, page = 1, onPageChange, siblingCount = 1 }: PaginationProps): React.ReactElement {
  return (
    <PaginationRoot
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={(details) => onPageChange?.(details.page)}
      siblingCount={siblingCount}
    >
      <PaginationPrevTrigger />
      <PaginationPageText />
      <PaginationItem />
      <PaginationEllipsis />
      <PaginationNextTrigger />
    </PaginationRoot>
  )
}