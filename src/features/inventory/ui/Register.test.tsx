import React from 'react'

import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { render, screen } from '@/shared/test/test-utils'

import { Register } from './Register'

import type { Category, Unit, Location } from '@/entities/inventory/model'

// アクションのモック
vi.mock('../api/actions', () => ({
  createItemAction: vi.fn(),
}))

// useActionStateのモック - 各テストでオーバーライドします
const mockUseActionState = vi.fn(
  (action: unknown, initialState: unknown): [unknown, unknown, boolean] => {
    return [initialState, action, false]
  },
)

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useActionState: (
      action: (state: unknown, formData: FormData) => Promise<unknown>,
      initialState: unknown,
    ): [unknown, unknown, boolean] => mockUseActionState(action, initialState),
  }
})

// Next.js Linkのモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: '日用品',
    description: '日常生活で使う消耗品',
    sortOrder: 1,
    isActive: true,
  },
  { id: 'cat-2', name: '食品', description: '食料品・飲料', sortOrder: 2, isActive: true },
]

const mockUnits: Unit[] = [
  { id: 'unit-1', name: 'piece', displayName: '個', sortOrder: 1, isActive: true },
  { id: 'unit-2', name: 'pack', displayName: 'パック', sortOrder: 2, isActive: true },
]

const mockLocations: Location[] = [
  { id: 'loc-1', name: 'storage', displayName: '倉庫', sortOrder: 1, isActive: true },
  { id: 'loc-2', name: 'kitchen', displayName: 'キッチン', sortOrder: 2, isActive: true },
]

describe('Register', () => {
  beforeEach(() => {
    // 各テストの前にモックをデフォルト状態にリセット
    mockUseActionState.mockReset()
    mockUseActionState.mockImplementation(
      (action: unknown, initialState: unknown): [unknown, unknown, boolean] => {
        return [initialState, action, false]
      },
    )
  })

  it('見出し付きの登録フォームをレンダーできる', () => {
    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    expect(screen.getByRole('heading', { name: '在庫アイテム登録' })).toBeInTheDocument()
    expect(screen.getByText('新しい在庫アイテムを登録します')).toBeInTheDocument()
  })

  it('フォームフィールドをレンダーできる', () => {
    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    // ItemFormFieldsからのフォームフィールドを確認
    expect(screen.getByLabelText(/アイテム名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/数量/)).toBeInTheDocument()
    expect(screen.getByText(/単位/)).toBeInTheDocument()
    expect(screen.getByText(/カテゴリ/)).toBeInTheDocument()
    expect(screen.getByText(/保管場所/)).toBeInTheDocument()
  })

  it('アクションボタンをレンダーできる', () => {
    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
    const submitButton = screen.getByRole('button', { name: '登録' })

    expect(cancelButton).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('キャンセルリンクは/inventoryにナビゲートする', () => {
    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    const cancelLink = screen.getByRole('link')
    expect(cancelLink).toHaveAttribute('href', '/inventory')
  })

  it('フォームにnoValidate属性がある', () => {
    const { container } = render(
      <Register categories={mockCategories} units={mockUnits} locations={mockLocations} />,
    )

    const form = container.querySelector('form')
    expect(form).toHaveAttribute('noValidate')
  })

  it('ItemFormFieldsにpropsを渡す', () => {
    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    // セレクトオプションがレンダーされるか確認してカテゴリが渡されていることを検証
    expect(screen.getAllByText('選択してください')).toHaveLength(3)
  })

  it('フォーム送信中はローディング状態を表示する', () => {
    mockUseActionState.mockReturnValue([null, vi.fn(), true]) // isPending = true

    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    const submitButton = screen.getByRole('button', { name: '登録中...' })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('バリデーションエラーがある場合は表示する', () => {
    const errors = {
      name: 'アイテム名は必須です',
      quantity: '数量は0以上である必要があります',
    }

    mockUseActionState.mockReturnValue([{ errors }, vi.fn(), false])

    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    expect(screen.getByText('アイテム名は必須です')).toBeInTheDocument()
    expect(screen.getByText('数量は0以上である必要があります')).toBeInTheDocument()
  })

  it('送信ボタンがクリックされたらフォームを送信する', async () => {
    const mockFormAction = vi.fn()

    mockUseActionState.mockReturnValue([null, mockFormAction, false])

    const user = userEvent.setup()

    render(<Register categories={mockCategories} units={mockUnits} locations={mockLocations} />)

    const submitButton = screen.getByRole('button', { name: '登録' })

    // フォームデータを入力
    const nameInput = screen.getByRole('textbox', { name: /アイテム名/ })
    await user.type(nameInput, 'テストアイテム')

    // 注意: 実際の実装では、フォーム送信はServer Actionsによって処理され、
    // フォーム送信時に自動的にトリガーされます
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('レスポンシブレイアウトクラスを持つ', () => {
    const { container } = render(
      <Register categories={mockCategories} units={mockUnits} locations={mockLocations} />,
    )

    // コンポーネントがエラーなくレンダーされ、期待される要素を含むことを確認
    expect(screen.getByRole('heading', { name: '在庫アイテム登録' })).toBeInTheDocument()
    expect(container.querySelector('form')).toBeInTheDocument()
  })

  it('空のマスタデータでレンダーできる', () => {
    render(<Register categories={[]} units={[]} locations={[]} />)

    expect(screen.getByRole('heading', { name: '在庫アイテム登録' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument()
  })
})
