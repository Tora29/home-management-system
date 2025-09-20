'use client'

import { useCallback, useState, useTransition } from 'react'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { Container, Grid, GridItem, Heading, Button, HStack } from '@chakra-ui/react'
import { LuPlus, LuSearch } from 'react-icons/lu'

import { CategorySelect } from '@/entities/inventory/ui/CategorySelect'
import { LocationSelect } from '@/entities/inventory/ui/LocationSelect'
import { Pagination } from '@/entities/inventory/ui/Pagination'
import { SearchBar } from '@/entities/inventory/ui/SearchBar'
import { Table } from '@/entities/inventory/ui/Table'

import type { SearchResponse } from '../model/search-validators'
import type { ItemWithCategory } from '../model/types'
import type { Category, Location } from '@/entities/inventory/model'

interface ManagementViewProps {
  initialData: SearchResponse
  categories: Category[]
  locations: Location[]
}

/**
 * 在庫管理画面のメインビュー
 *
 * @returns 在庫管理画面
 */
export function ManagementView({
  initialData,
  categories,
  locations,
}: ManagementViewProps): React.ReactElement {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // URLパラメータの取得
  const currentSearch = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentLocation = searchParams.get('location') || ''
  const currentPage = Number(searchParams.get('page')) || 1

  // ローカル検索値の管理
  const [localSearch, setLocalSearch] = useState(currentSearch)

  // URLパラメータを更新する関数
  const updateSearchParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || (value === 1 && key === 'page')) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router, searchParams],
  )

  const handleSearchSubmit = useCallback(() => {
    updateSearchParams({ search: localSearch, page: 1 })
  }, [localSearch, updateSearchParams])

  const handleSearchClear = useCallback(() => {
    setLocalSearch('')
    updateSearchParams({ search: '', page: 1 })
  }, [updateSearchParams])

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      updateSearchParams({ category: categoryId, page: 1 })
    },
    [updateSearchParams],
  )

  const handleLocationChange = useCallback(
    (locationId: string) => {
      updateSearchParams({ location: locationId, page: 1 })
    },
    [updateSearchParams],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page })
    },
    [updateSearchParams],
  )

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(12, minmax(0, 1fr))" gap={6}>
        {/* ヘッダー部分 */}
        <GridItem colSpan={12}>
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Heading size="xl">在庫管理</Heading>
            <Button colorPalette="blue" onClick={() => router.push('/inventory/register')}>
              <LuPlus />
              新規登録
            </Button>
          </HStack>
        </GridItem>

        {/* 検索・フィルター部分 */}
        <SearchBar value={localSearch} onSearch={setLocalSearch} colSpan={{ base: 12, md: 7 }} />
        <CategorySelect
          categories={categories}
          selectedCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
          colSpan={{ base: 6, md: 2 }}
        />
        <LocationSelect
          locations={locations}
          selectedLocation={currentLocation}
          onLocationChange={handleLocationChange}
          colSpan={{ base: 6, md: 2 }}
        />
        <GridItem colSpan={{ base: 12, md: 1 }}>
          <Button onClick={handleSearchSubmit} colorPalette="blue" size="md" width="full">
            <LuSearch />
            検索
          </Button>
        </GridItem>
        {localSearch && (
          <GridItem colSpan={12}>
            <Button onClick={handleSearchClear} variant="ghost" size="sm">
              クリア
            </Button>
          </GridItem>
        )}

        {/* テーブル部分 */}
        <Table items={initialData.items as ItemWithCategory[]} isLoading={isPending} colSpan={12} />

        {/* ページネーション部分 */}
        {initialData.pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={initialData.pagination.totalPages}
            totalItems={initialData.pagination.total}
            pageSize={initialData.pagination.limit}
            onPageChange={handlePageChange}
            colSpan={12}
          />
        )}
      </Grid>
    </Container>
  )
}
