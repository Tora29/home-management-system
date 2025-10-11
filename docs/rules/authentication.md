# 認証の実装ガイド（Auth.js v5）

**最終更新:** 2025-10-11
**対象:** Next.js 15 + Auth.js v5 + Prisma

---

## 🎯 基本方針

このプロジェクトでは、**Phase 1から認証基盤を構築**し、マルチユーザー対応を前提とした設計を採用します。

### なぜPhase 1から？

1. **後から追加するのは困難**
   - すべてのテーブルに `userId` を追加する必要がある
   - 既存データのマイグレーションが複雑になる

2. **リリース前提の設計**
   - 将来的な一般公開を見据えて最初から構築

3. **セキュリティの確保**
   - 個人情報（給与・資産）を扱うため、認証は必須

---

## 📦 必要なパッケージ

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

---

## 📁 ディレクトリ構成

Feature-Sliced Design（FSD）に従った認証機能の配置：

```
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts          # Auth.js Route Handler
│   ├── (auth)/                # 認証関連ページグループ
│   │   ├── login/
│   │   │   └── page.tsx       # ログインページ
│   │   └── register/
│   │       └── page.tsx       # 登録ページ
│   └── (dashboard)/           # 認証必須ページグループ
│       └── [...pages]
│
├── features/
│   └── auth/
│       ├── api/
│       │   ├── actions.ts     # ログイン/ログアウト Server Actions
│       │   └── queries.ts     # セッション取得
│       ├── model/             # 型定義（entities/user から参照）
│       └── ui/
│           ├── LoginForm.tsx  # ログインフォーム
│           ├── RegisterForm.tsx  # 登録フォーム
│           └── UserMenu.tsx   # ユーザーメニュー
│
├── entities/
│   └── user/
│       ├── model/
│       │   └── user.ts        # Userスキーマ（zod）
│       └── ui/
│           └── UserAvatar.tsx # ユーザーアバター
│
└── shared/
    ├── lib/
    │   ├── auth.ts            # Auth.js 設定
    │   └── prisma.ts          # Prisma Client
    └── middleware/
        └── auth.ts            # 認証ミドルウェア（オプション）
```

---

## 🔧 実装ステップ

### Step 1: Prisma スキーマの定義

```prisma
// prisma/schema.prisma

model User {
  id             String    @id @default(uuid())
  name           String?
  email          String    @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  accounts Account[]
  sessions Session[]

  // ビジネスデータとのリレーション
  salaryStatements   SalaryStatement[]
  bankAccounts       BankAccount[]
  investmentAccounts InvestmentAccount[]

  @@map("users")
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

### Step 2: Zodスキーマの定義（entities層）

```typescript
// entities/user/model/user.ts
import { z } from 'zod'

/**
 * ログインスキーマ
 */
export const loginSchema = z.object({
  email: z.string().min(1, '必須項目です').email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * 登録スキーマ
 */
export const registerSchema = z
  .object({
    name: z.string().min(1, '必須項目です').max(50, '名前は50文字以内で入力してください'),
    email: z.string().min(1, '必須項目です').email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上である必要があります')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは大文字、小文字、数字を含む必要があります',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Userの型定義（Prismaから生成される型と同等）
 */
export type User = {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Step 3: Auth.js の設定（shared層）

```typescript
// shared/lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './prisma'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/entities/user/model/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // zodでバリデーション
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        // ユーザー検索
        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user || !user.hashedPassword) return null

        // パスワード検証
        const isValid = await bcrypt.compare(parsed.data.password, user.hashedPassword)

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = ['/login', '/register'].includes(nextUrl.pathname)

      // 認証ページへのアクセス
      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl))
        return true
      }

      // その他のページ（認証必須）
      if (!isLoggedIn) return false

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

### Step 4: Route Handler（app層）

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/shared/lib/auth'

export const { GET, POST } = handlers
```

### Step 5: ミドルウェア（ルート）

```typescript
// middleware.ts
import { auth } from '@/shared/lib/auth'

export default auth((req) => {
  // authorized callbackで制御されるため、ここでは追加処理のみ
  return
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### Step 6: Server Actions（features層）

```typescript
// features/auth/api/actions.ts
'use server'

import { signIn, signOut } from '@/shared/lib/auth'
import { loginSchema, registerSchema } from '@/entities/user/model/user'
import { db } from '@/shared/lib/prisma'
import bcrypt from 'bcryptjs'
import type { ActionState } from '@/shared/types/action'

/**
 * ログイン
 */
export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = Object.fromEntries(formData)
  const parsed = loginSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false,
      error: {
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      formData: rawData as Record<string, string>,
      timestamp: Date.now(),
    }
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })

    return {
      success: true,
      data: undefined,
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        formError: ['メールアドレスまたはパスワードが間違っています'],
      },
      formData: rawData as Record<string, string>,
      timestamp: Date.now(),
    }
  }
}

/**
 * 登録
 */
export async function register(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = Object.fromEntries(formData)
  const parsed = registerSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false,
      error: {
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      formData: rawData as Record<string, string>,
      timestamp: Date.now(),
    }
  }

  try {
    // メールアドレスの重複チェック
    const existing = await db.user.findUnique({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return {
        success: false,
        error: {
          fieldErrors: {
            email: ['このメールアドレスは既に登録されています'],
          },
        },
        formData: rawData as Record<string, string>,
        timestamp: Date.now(),
      }
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

    // ユーザー作成
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        hashedPassword,
      },
    })

    // 自動ログイン
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })

    return {
      success: true,
      data: undefined,
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        formError: ['登録に失敗しました。もう一度お試しください。'],
      },
      formData: rawData as Record<string, string>,
      timestamp: Date.now(),
    }
  }
}

/**
 * ログアウト
 */
export async function logout() {
  await signOut({ redirect: true, redirectTo: '/login' })
}
```

### Step 7: クエリ（features層）

```typescript
// features/auth/api/queries.ts
import 'server-only'
import { auth } from '@/shared/lib/auth'

/**
 * セッション取得
 */
export async function getSession() {
  return await auth()
}

/**
 * 現在のユーザー取得
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

/**
 * ユーザーID取得
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser()
  return user?.id
}
```

### Step 8: UI コンポーネント（features層）

```typescript
// features/auth/ui/LoginForm.tsx
'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../api/actions'
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  VStack,
} from '@/shared/components/ui'
import type { ActionState } from '@/shared/types/action'

const initialState: ActionState = {
  success: false,
  error: {},
}

export function LoginForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(login, initialState)

  useEffect(() => {
    if (state.success) {
      router.push('/')
      router.refresh()
    }
  }, [state.success, router])

  return (
    <form action={formAction}>
      <VStack spacing={4}>
        {!state.success && state.error.formError && (
          <Alert status="error">
            <AlertIcon />
            {state.error.formError[0]}
          </Alert>
        )}

        <FormControl
          isInvalid={!state.success && !!state.error.fieldErrors?.email}
        >
          <FormLabel>メールアドレス</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="example@example.com"
            disabled={isPending}
            defaultValue={state.formData?.email || ''}
          />
          {!state.success && state.error.fieldErrors?.email && (
            <FormErrorMessage>
              {state.error.fieldErrors.email[0]}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl
          isInvalid={!state.success && !!state.error.fieldErrors?.password}
        >
          <FormLabel>パスワード</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
          />
          {!state.success && state.error.fieldErrors?.password && (
            <FormErrorMessage>
              {state.error.fieldErrors.password[0]}
            </FormErrorMessage>
          )}
        </FormControl>

        <Button type="submit" isLoading={isPending} width="full">
          ログイン
        </Button>
      </VStack>
    </form>
  )
}
```

---

## 🔐 セキュリティのベストプラクティス

### 1. パスワードのハッシュ化

```typescript
// 必ずbcrypt等でハッシュ化してから保存
const hashedPassword = await bcrypt.hash(password, 10)
```

### 2. Server Actions内での認証チェック

```typescript
export async function createSalary(...) {
  // 必ず認証チェック
  const userId = await getCurrentUserId()
  if (!userId) {
    return {
      success: false,
      error: { formError: ['認証が必要です'] }
    }
  }

  // userIdを紐付けてデータ作成
  await db.salaryStatement.create({
    data: { ...data, userId }
  })
}
```

### 3. Row Level Security（RLS）

```typescript
// データ取得時は必ずuserIdでフィルタリング
export async function getSalaryStatements() {
  const userId = await getCurrentUserId()
  if (!userId) return []

  return await db.salaryStatement.findMany({
    where: { userId }, // ✅ 必須
  })
}
```

---

## 📝 TypeScript型定義の拡張

```typescript
// types/next-auth.d.ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      image: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    image: string | null
  }
}
```

---

## 🎯 使用例

### ページでの認証チェック

```tsx
// app/(dashboard)/salary/page.tsx
import { getCurrentUser } from '@/features/auth/api/queries'
import { getSalaryStatements } from '@/features/salary/api/queries'
import { redirect } from 'next/navigation'

export default async function SalaryPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const statements = await getSalaryStatements()

  return (
    <div>
      <h1>{user.name}さんの給与明細</h1>
      {/* ... */}
    </div>
  )
}
```

---

## 📌 まとめ

### 重要なポイント

1. **Phase 1から認証を実装**
   - すべてのビジネスデータに `userId` を紐付け

2. **FSDアーキテクチャに従う**
   - `features/auth` に認証機能を集約
   - `entities/user` にユーザーモデルを定義

3. **Result型パターンを使用**
   - Server Actionsで型安全なエラーハンドリング

4. **セキュリティ最優先**
   - パスワードのハッシュ化
   - Server Actions内での認証チェック
   - Row Level Security

---

**認証は個人情報を扱うアプリケーションの基盤です。最初から堅牢に実装しましょう。**
