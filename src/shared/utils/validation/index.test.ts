import { describe, it, expect } from 'vitest'

import { validate, validators } from './index'

describe('validate', () => {
  describe('すべてのバリデーションが成功した場合', () => {
    describe('有効なデータが提供された時', () => {
      it('成功を返す', () => {
        const data = {
          name: 'Test Name',
          email: 'test@example.com',
          age: 25,
        }

        const schema = {
          name: [validators.required(), validators.minLength(3)],
          email: [validators.required(), validators.email()],
          age: [validators.minNumber(18)],
        }

        const result = validate(data, schema)

        expect(result.success).toBe(true)
        expect(result.errors).toEqual({})
      })
    })
  })

  describe('バリデーションが失敗した場合', () => {
    describe('無効なデータが提供された時', () => {
      it('エラーを返す', () => {
        const data = {
          name: '',
          email: 'invalid-email',
          age: 15,
        }

        const schema = {
          name: [validators.required()],
          email: [validators.email()],
          age: [validators.minNumber(18, '年齢は18歳以上である必要があります')],
        }

        const result = validate(data, schema)

        expect(result.success).toBe(false)
        expect(result.errors.name).toBeDefined()
        expect(result.errors.email).toBeDefined()
        expect(result.errors.age).toBe('年齢は18歳以上である必要があります')
      })
    })

    describe('複数のバリデーションルールがある時', () => {
      it('最初のエラーで停止する', () => {
        const data = {
          name: '',
        }

        const schema = {
          name: [
            validators.required('必須項目です'),
            validators.minLength(5, '5文字以上入力してください'),
          ],
        }

        const result = validate(data, schema)

        expect(result.success).toBe(false)
        expect(result.errors.name).toBe('必須項目です')
      })
    })
  })
})

describe('validators', () => {
  describe('required', () => {
    describe('空でない値の場合', () => {
      it('パスする', () => {
        expect(validators.required().validate('test')).toBe(true)
        expect(validators.required().validate(123)).toBe(true)
        expect(validators.required().validate(0)).toBe(true)
        expect(validators.required().validate(false)).toBe(true)
      })
    })

    describe('空の値の場合', () => {
      it('失敗する', () => {
        expect(validators.required().validate('')).toBe(false)
        expect(validators.required().validate(null)).toBe(false)
        expect(validators.required().validate(undefined)).toBe(false)
      })
    })
  })

  describe('requiredString', () => {
    describe('空でない文字列の場合', () => {
      it('パスする', () => {
        expect(validators.requiredString().validate('test')).toBe(true)
        expect(validators.requiredString().validate(' test ')).toBe(true)
      })
    })

    describe('空の文字列や文字列以外の場合', () => {
      it('失敗する', () => {
        expect(validators.requiredString().validate('')).toBe(false)
        expect(validators.requiredString().validate('   ')).toBe(false)
        expect(validators.requiredString().validate(123)).toBe(false)
        expect(validators.requiredString().validate(null)).toBe(false)
      })
    })
  })

  describe('minNumber', () => {
    describe('最小値以上の数値の場合', () => {
      it('パスする', () => {
        expect(validators.minNumber(10).validate(10)).toBe(true)
        expect(validators.minNumber(10).validate(15)).toBe(true)
      })
    })

    describe('最小値未満の数値や数値以外の場合', () => {
      it('失敗する', () => {
        expect(validators.minNumber(10).validate(9)).toBe(false)
        expect(validators.minNumber(10).validate('10')).toBe(false)
      })
    })
  })

  describe('maxNumber', () => {
    describe('最大値以下の数値の場合', () => {
      it('パスする', () => {
        expect(validators.maxNumber(10).validate(10)).toBe(true)
        expect(validators.maxNumber(10).validate(5)).toBe(true)
      })
    })

    describe('最大値を超える数値や数値以外の場合', () => {
      it('失敗する', () => {
        expect(validators.maxNumber(10).validate(11)).toBe(false)
        expect(validators.maxNumber(10).validate('10')).toBe(false)
      })
    })
  })

  describe('minLength', () => {
    describe('最小文字数以上の文字列の場合', () => {
      it('パスする', () => {
        expect(validators.minLength(3).validate('abc')).toBe(true)
        expect(validators.minLength(3).validate('abcd')).toBe(true)
      })
    })

    describe('最小文字数未満の文字列の場合', () => {
      it('失敗する', () => {
        expect(validators.minLength(3).validate('ab')).toBe(false)
        expect(validators.minLength(3).validate('')).toBe(false)
      })
    })
  })

  describe('maxLength', () => {
    describe('最大文字数以下の文字列の場合', () => {
      it('パスする', () => {
        expect(validators.maxLength(3).validate('abc')).toBe(true)
        expect(validators.maxLength(3).validate('ab')).toBe(true)
      })
    })

    describe('最大文字数を超える文字列の場合', () => {
      it('失敗する', () => {
        expect(validators.maxLength(3).validate('abcd')).toBe(false)
      })
    })
  })

  describe('pattern', () => {
    describe('パターンに一致する場合', () => {
      it('パスする', () => {
        const alphaOnly = validators.pattern(/^[a-zA-Z]+$/, 'アルファベットのみ')
        expect(alphaOnly.validate('ABC')).toBe(true)
        expect(alphaOnly.validate('abc')).toBe(true)
      })
    })

    describe('パターンに一致しない場合', () => {
      it('失敗する', () => {
        const alphaOnly = validators.pattern(/^[a-zA-Z]+$/, 'アルファベットのみ')
        expect(alphaOnly.validate('123')).toBe(false)
        expect(alphaOnly.validate('abc123')).toBe(false)
      })
    })
  })

  describe('email', () => {
    describe('有効なメールアドレスの場合', () => {
      it('パスする', () => {
        expect(validators.email().validate('test@example.com')).toBe(true)
        expect(validators.email().validate('user.name@example.co.jp')).toBe(true)
      })
    })

    describe('無効なメールアドレスの場合', () => {
      it('失敗する', () => {
        expect(validators.email().validate('invalid')).toBe(false)
        expect(validators.email().validate('@example.com')).toBe(false)
        expect(validators.email().validate('test@')).toBe(false)
        expect(validators.email().validate('test @example.com')).toBe(false)
      })
    })
  })

  describe('futureDate', () => {
    describe('未来の日付の場合', () => {
      it('パスする', () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        expect(validators.futureDate().validate(tomorrow)).toBe(true)
        expect(validators.futureDate().validate(tomorrow.toISOString())).toBe(true)
      })
    })

    describe('過去の日付の場合', () => {
      it('失敗する', () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        expect(validators.futureDate().validate(yesterday)).toBe(false)
      })
    })

    describe('空の値の場合（オプション）', () => {
      it('パスする', () => {
        expect(validators.futureDate().validate(null)).toBe(true)
        expect(validators.futureDate().validate(undefined)).toBe(true)
        expect(validators.futureDate().validate('')).toBe(true)
      })
    })
  })

  describe('custom', () => {
    describe('カスタムバリデーション関数を使用する場合', () => {
      it('正しく動作する', () => {
        const isEven = validators.custom<number>(
          (value) => typeof value === 'number' && value % 2 === 0,
          '偶数である必要があります',
        )

        expect(isEven.validate(2)).toBe(true)
        expect(isEven.validate(4)).toBe(true)
        expect(isEven.validate(3)).toBe(false)
        expect(isEven.validate('2')).toBe(false)
      })
    })
  })
})
