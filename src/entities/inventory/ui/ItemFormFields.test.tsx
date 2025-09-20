import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import { render, screen } from '@/shared/test/test-utils'

import { ItemFormFields } from './ItemFormFields'

import type { Category, Unit, Location } from '../model'

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: '日用品',
    description: '日常生活で使う消耗品',
    sortOrder: 1,
    isActive: true,
  },
  { id: 'cat-2', name: '食品', description: '食料品・飲料', sortOrder: 2, isActive: true },
  {
    id: 'cat-3',
    name: '清掃用品',
    description: '掃除に使う道具・薬品',
    sortOrder: 3,
    isActive: true,
  },
]

const mockUnits: Unit[] = [
  { id: 'unit-1', name: 'piece', displayName: '個', sortOrder: 1, isActive: true },
  { id: 'unit-2', name: 'pack', displayName: 'パック', sortOrder: 2, isActive: true },
  { id: 'unit-3', name: 'box', displayName: '箱', sortOrder: 3, isActive: true },
]

const mockLocations: Location[] = [
  { id: 'loc-1', name: 'storage', displayName: '倉庫', sortOrder: 1, isActive: true },
  { id: 'loc-2', name: 'kitchen', displayName: 'キッチン', sortOrder: 2, isActive: true },
  { id: 'loc-3', name: 'bathroom', displayName: 'バスルーム', sortOrder: 3, isActive: true },
]

describe('ItemFormFields', () => {
  it('すべてのフォームフィールドをレンダーできる', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    // 必須フィールドを確認
    expect(screen.getByLabelText(/アイテム名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/数量/)).toBeInTheDocument()
    expect(screen.getByText(/単位/)).toBeInTheDocument()
    expect(screen.getByText(/カテゴリ/)).toBeInTheDocument()
    expect(screen.getByText(/保管場所/)).toBeInTheDocument()

    // オプションフィールドを確認
    expect(screen.getByLabelText(/説明/)).toBeInTheDocument()
    expect(screen.getByLabelText(/バーコード/)).toBeInTheDocument()
    expect(screen.getByLabelText(/備考/)).toBeInTheDocument()
  })

  it('フォーム送信用の正しいname属性でフォームフィールドをレンダーできる', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    // inputのname属性を確認
    expect(screen.getByRole('textbox', { name: /アイテム名/ })).toHaveAttribute('name', 'name')
    expect(screen.getByRole('textbox', { name: /説明/ })).toHaveAttribute('name', 'description')
    expect(screen.getByRole('spinbutton', { name: /数量/ })).toHaveAttribute('name', 'quantity')
    expect(screen.getByRole('textbox', { name: /バーコード/ })).toHaveAttribute('name', 'barcode')
    expect(screen.getByRole('textbox', { name: /備考/ })).toHaveAttribute('name', 'notes')
  })

  it('errors propが提供された場合はエラーメッセージを表示する', () => {
    const errors = {
      name: 'アイテム名は必須です',
      quantity: '数量は0以上である必要があります',
      unit: '単位を選択してください',
      categoryId: 'カテゴリを選択してください',
      location: '保管場所を選択してください',
    }

    render(
      <form>
        <ItemFormFields
          categories={mockCategories}
          units={mockUnits}
          locations={mockLocations}
          errors={errors}
        />
      </form>,
    )

    expect(screen.getByText('アイテム名は必須です')).toBeInTheDocument()
    expect(screen.getByText('数量は0以上である必要があります')).toBeInTheDocument()
    expect(screen.getByText('単位を選択してください')).toBeInTheDocument()
    expect(screen.getByText('カテゴリを選択してください')).toBeInTheDocument()
    expect(screen.getByText('保管場所を選択してください')).toBeInTheDocument()
  })

  it('入力フィールドのプレースホルダーをレンダーできる', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    expect(screen.getByPlaceholderText('例: トイレットペーパー')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('アイテムの説明（任意）')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('JANコードなど')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('メモ・注意事項など')).toBeInTheDocument()
  })

  it('セレクトボックスのプレースホルダーをレンダーできる', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    // セレクトボックスのプレースホルダーを確認
    const selectPlaceholders = screen.getAllByText('選択してください')
    expect(selectPlaceholders).toHaveLength(3) // 単位、カテゴリ、保管場所
  })

  it('テキストフィールドへのユーザー入力を受け付ける', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    const nameInput = screen.getByRole('textbox', { name: /アイテム名/ })
    const descriptionInput = screen.getByRole('textbox', { name: /説明/ })
    const barcodeInput = screen.getByRole('textbox', { name: /バーコード/ })
    const notesInput = screen.getByRole('textbox', { name: /備考/ })

    await user.type(nameInput, 'テストアイテム')
    await user.type(descriptionInput, 'これはテスト用のアイテムです')
    await user.type(barcodeInput, '4901234567890')
    await user.type(notesInput, 'テスト用のメモ')

    expect(nameInput).toHaveValue('テストアイテム')
    expect(descriptionInput).toHaveValue('これはテスト用のアイテムです')
    expect(barcodeInput).toHaveValue('4901234567890')
    expect(notesInput).toHaveValue('テスト用のメモ')
  })

  it('数値フィールドへのユーザー入力を受け付ける', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: /数量/ })

    await user.clear(quantityInput)
    await user.type(quantityInput, '25')

    expect(quantityInput).toHaveValue(25)
  })

  it('数量入力にminとstep属性を設定する', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    const quantityInput = screen.getByRole('spinbutton', { name: /数量/ })

    expect(quantityInput).toHaveAttribute('min', '0')
    expect(quantityInput).toHaveAttribute('step', '1')
    expect(quantityInput).toHaveAttribute('type', 'number')
  })

  it('空のカテゴリ、単位、保管場所でレンダーできる', () => {
    render(
      <form>
        <ItemFormFields categories={[]} units={[]} locations={[]} />
      </form>,
    )

    // フォーム構造はレンダーされるべき
    expect(screen.getByLabelText(/アイテム名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/数量/)).toBeInTheDocument()
  })

  it('errors propが提供されない場合はエラーを表示しない', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    // エラーテキスト要素は空または非表示であるべき
    const errorTexts = screen.queryAllByText(/は必須です/)
    expect(errorTexts).toHaveLength(0)
  })

  it('必須フィールドに必須インジケーターをレンダーする', () => {
    render(
      <form>
        <ItemFormFields categories={mockCategories} units={mockUnits} locations={mockLocations} />
      </form>,
    )

    // 必須フィールドがRequiredIndicatorコンポーネント（*としてレンダー）でマークされていることを確認
    // コンポーネントでは、必須フィールドにField.RequiredIndicator要素が表示される
    const asterisks = screen.getAllByText('*')
    expect(asterisks.length).toBeGreaterThan(0)
  })
})
