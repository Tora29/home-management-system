import Link from 'next/link'

import { Box, Button, Card, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'

function Header() {
  return (
    <Box textAlign="center">
      <Heading size="4xl" mb={4} color="primary.500">
        個人資産管理システム
      </Heading>
      <Text fontSize="xl" color="text.secondary">
        給与・資産情報を一元管理し、収支を可視化
      </Text>
    </Box>
  )
}

function QuickActions() {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="lg" mb={6}>
          クイックアクション
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
          <Button colorPalette="primary" size="lg" h="auto" py={6}>
            <Stack gap={2} align="center">
              <Text fontSize="2xl">💰</Text>
              <Text>給与明細登録</Text>
            </Stack>
          </Button>
          <Button variant="outline" colorPalette="primary" size="lg" h="auto" py={6}>
            <Stack gap={2} align="center">
              <Text fontSize="2xl">📊</Text>
              <Text>給与明細一覧</Text>
            </Stack>
          </Button>
          <Button variant="outline" colorPalette="secondary" size="lg" h="auto" py={6}>
            <Stack gap={2} align="center">
              <Text fontSize="2xl">💼</Text>
              <Text>資産管理</Text>
            </Stack>
          </Button>
        </Grid>
      </Card.Body>
    </Card.Root>
  )
}

function SummaryCards() {
  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
      <Card.Root>
        <Card.Body>
          <Text fontSize="sm" color="text.secondary" mb={2}>
            今月の給与（予定）
          </Text>
          <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="primary.500">
            --
          </Text>
          <Text fontSize="xs" color="text.muted" mt={2}>
            まだ登録されていません
          </Text>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <Text fontSize="sm" color="text.secondary" mb={2}>
            総資産額
          </Text>
          <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="primary.500">
            --
          </Text>
          <Text fontSize="xs" color="text.muted" mt={2}>
            資産情報を登録してください
          </Text>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <Text fontSize="sm" color="text.secondary" mb={2}>
            有給残日数
          </Text>
          <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="secondary.500">
            --
          </Text>
          <Text fontSize="xs" color="text.muted" mt={2}>
            給与明細を登録すると表示されます
          </Text>
        </Card.Body>
      </Card.Root>
    </Grid>
  )
}

function Features() {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="lg" mb={6}>
          システムの特徴
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Box>
            <Text fontWeight="semibold" mb={2} color="primary.500">
              📝 給与明細管理
            </Text>
            <Text fontSize="sm" color="text.secondary">
              毎月の給与明細を登録・管理。支給項目・控除項目を詳細に記録し、年間統計を自動算出します。
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2} color="primary.500">
              💰 資産管理
            </Text>
            <Text fontSize="sm" color="text.secondary">
              銀行口座・投資口座の残高を記録。資産の推移を可視化し、総資産額を一目で把握できます。
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2} color="primary.500">
              📊 データ分析
            </Text>
            <Text fontSize="sm" color="text.secondary">
              収入推移・資産推移をグラフで表示。データに基づいた意思決定をサポートします。
            </Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2} color="primary.500">
              🔒 セキュリティ
            </Text>
            <Text fontSize="sm" color="text.secondary">
              認証機能により個人情報を保護。Row Level
              Securityで他ユーザーのデータにアクセスできないよう設計されています。
            </Text>
          </Box>
        </Grid>
      </Card.Body>
    </Card.Root>
  )
}

function DevTools() {
  return (
    <Card.Root bg="secondary.50" borderColor="secondary.200">
      <Card.Body>
        <Heading size="md" mb={4} color="secondary.700">
          開発用ツール
        </Heading>
        <Flex gap={3} wrap="wrap">
          <Link href="/design-system">
            <Button variant="outline" colorPalette="secondary">
              🎨 デザインシステム
            </Button>
          </Link>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

/**
 * トップページ（ダッシュボード）
 */
export default function Home() {
  return (
    <Box bg="bg.light" minH="100vh">
      <Container maxW="6xl" py={12}>
        <Stack gap={12}>
          <Header />
          <QuickActions />
          <SummaryCards />
          <Features />
          <DevTools />
        </Stack>
      </Container>
    </Box>
  )
}
