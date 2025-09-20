/**
 * 在庫検索のビジネスロジック
 */

'use server'

import { inventorySearchRepository } from '../repository/search'

import type { SearchParams, SearchResponse } from '../model/search-validators'

/**
 * 在庫アイテムを検索
 */
export async function searchInventoryItems(params: SearchParams): Promise<SearchResponse> {
  const { items, total } = await inventorySearchRepository.searchItems(params)

  const totalPages = Math.ceil(total / params.limit)

  return {
    items,
    pagination: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    },
  }
}
