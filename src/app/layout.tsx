import { Inter } from 'next/font/google'

import { Providers } from '@/shared/lib/chakra-provider'

import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '個人資産管理システム',
  description:
    '給与・資産情報を一元管理し、収支の可視化と将来の資産形成をサポートするWebアプリケーション',
}

/**
 * ルートレイアウト
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
