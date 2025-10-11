import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import jsdoc from 'eslint-plugin-jsdoc'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      'prisma/**/*.ts',
      'scripts/**/*.ts',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      jsdoc,
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
    },
    rules: {
      // ========== JSDoc関連ルール ==========
      'jsdoc/check-alignment': 'warn',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['internal', 'experimental', 'deprecated'],
        },
      ],
      'jsdoc/check-types': 'off', // TypeScriptが型チェックを行うため無効
      'jsdoc/require-description': [
        'warn',
        {
          contexts: ['FunctionDeclaration', 'ClassDeclaration', 'MethodDefinition'],
          descriptionStyle: 'body',
        },
      ],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration', 'TSEnumDeclaration'],
          checkConstructors: false,
        },
      ],
      'jsdoc/require-param': 'off', // TypeScriptの型情報を使用
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-returns': 'off', // TypeScriptの型情報を使用
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/no-undefined-types': 'off', // TypeScriptが型チェックを行う
      'jsdoc/valid-types': 'off', // TypeScriptが型チェックを行う
      'jsdoc/no-types': [
        'warn',
        {
          contexts: ['any'], // TypeScriptプロジェクトでは型注釈不要
        },
      ],
      'jsdoc/empty-tags': 'error',
      'jsdoc/multiline-blocks': ['warn', { noSingleLineBlocks: true }],
      'jsdoc/tag-lines': ['warn', 'never', { startLines: 1 }],

      // ========== TypeScript品質ルール ==========
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // TypeScriptコンパイルエラーを検出
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],

      // ========== 一般的な品質ルール ==========
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['warn', 100],
      'max-params': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
        },
      ],
      'no-duplicate-imports': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],

      // ========== セキュリティ関連 ==========
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // ========== import関連 ==========
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js組み込みモジュール
            'external', // npm packageなど
            'internal', // エイリアス(@/など)
            'parent', // 親ディレクトリ
            'sibling', // 同階層
            'index', // indexファイル
            'object', // object import
            'type', // type import
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]

export default eslintConfig
