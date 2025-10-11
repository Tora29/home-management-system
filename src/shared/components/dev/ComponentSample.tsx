'use client'

import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  Table,
  Badge,
  Flex,
  Grid,
  Separator,
} from '@chakra-ui/react'
import { useState } from 'react'

/**
 * Chakra UIコンポーネントサンプル（開発用）
 */
export function ComponentSample() {
  const [inputValue, setInputValue] = useState('')

  return (
    <Stack gap={12} p={8}>
      <Box>
        <Heading size="2xl" mb={4} color="primary.500">
          Component Samples
        </Heading>
        <Text color="text.secondary" fontSize="lg">
          Chakra UI v3 コンポーネントのサンプル集
        </Text>
      </Box>

      {/* Buttons */}
      <Box>
        <Heading size="lg" mb={4}>
          Buttons
        </Heading>
        <Separator mb={4} />
        <Stack gap={6}>
          <Box>
            <Text fontSize="sm" color="text.secondary" mb={2}>
              Primary Buttons
            </Text>
            <Flex gap={3} wrap="wrap">
              <Button colorPalette="primary" size="sm">
                Small
              </Button>
              <Button colorPalette="primary" size="md">
                Medium
              </Button>
              <Button colorPalette="primary" size="lg">
                Large
              </Button>
              <Button colorPalette="primary" disabled>
                Disabled
              </Button>
            </Flex>
          </Box>

          <Box>
            <Text fontSize="sm" color="text.secondary" mb={2}>
              Variant: Outline
            </Text>
            <Flex gap={3} wrap="wrap">
              <Button variant="outline" colorPalette="primary">
                Primary
              </Button>
              <Button variant="outline" colorPalette="secondary">
                Secondary
              </Button>
              <Button variant="outline" colorPalette="success">
                Success
              </Button>
              <Button variant="outline" colorPalette="danger">
                Danger
              </Button>
            </Flex>
          </Box>

          <Box>
            <Text fontSize="sm" color="text.secondary" mb={2}>
              Variant: Ghost
            </Text>
            <Flex gap={3} wrap="wrap">
              <Button variant="ghost" colorPalette="primary">
                Primary
              </Button>
              <Button variant="ghost" colorPalette="secondary">
                Secondary
              </Button>
              <Button variant="ghost" colorPalette="danger">
                Danger
              </Button>
            </Flex>
          </Box>
        </Stack>
      </Box>

      {/* Inputs */}
      <Box>
        <Heading size="lg" mb={4}>
          Input Fields
        </Heading>
        <Separator mb={4} />
        <Stack gap={4} maxW="md">
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              テキスト入力
            </Text>
            <Input
              placeholder="名前を入力してください"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              数値入力（金額）
            </Text>
            <Input type="number" placeholder="0" />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              日付入力
            </Text>
            <Input type="date" />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              無効状態
            </Text>
            <Input placeholder="無効" disabled />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              エラー状態
            </Text>
            <Input
              placeholder="エラー"
              borderColor="danger.500"
              _focus={{
                borderColor: 'danger.600',
                boxShadow: '0 0 0 1px var(--chakra-colors-danger-500)',
              }}
            />
            <Text fontSize="xs" color="danger.500" mt={1}>
              このフィールドは必須です
            </Text>
          </Box>
        </Stack>
      </Box>

      {/* Cards */}
      <Box>
        <Heading size="lg" mb={4}>
          Cards
        </Heading>
        <Separator mb={4} />
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
          <Card.Root>
            <Card.Body>
              <Heading size="md" mb={2}>
                シンプルカード
              </Heading>
              <Text color="text.secondary">カードの基本スタイル</Text>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Heading size="md" mb={2}>
                給与明細
              </Heading>
              <Text color="text.secondary" mb={4}>
                2025年10月
              </Text>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm">差引支給額</Text>
                <Text fontSize="2xl" fontWeight="bold" fontFamily="mono" color="primary.500">
                  ¥406,667
                </Text>
              </Flex>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">資産合計</Heading>
                <Badge colorPalette="success">更新</Badge>
              </Flex>
              <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="primary.500">
                ¥5,234,567
              </Text>
              <Text fontSize="sm" color="text.secondary" mt={2}>
                前月比 +¥150,000
              </Text>
            </Card.Body>
          </Card.Root>
        </Grid>
      </Box>

      {/* Table */}
      <Box>
        <Heading size="lg" mb={4}>
          Tables
        </Heading>
        <Separator mb={4} />
        <Card.Root>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>支給年月</Table.ColumnHeader>
                <Table.ColumnHeader>支給日</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">差引支給額</Table.ColumnHeader>
                <Table.ColumnHeader>操作</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>2025年10月</Table.Cell>
                <Table.Cell>2025/10/25</Table.Cell>
                <Table.Cell textAlign="right" fontFamily="mono" fontWeight="medium">
                  ¥406,667
                </Table.Cell>
                <Table.Cell>
                  <Button size="sm" variant="ghost">
                    詳細
                  </Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>2025年9月</Table.Cell>
                <Table.Cell>2025/09/25</Table.Cell>
                <Table.Cell textAlign="right" fontFamily="mono" fontWeight="medium">
                  ¥412,345
                </Table.Cell>
                <Table.Cell>
                  <Button size="sm" variant="ghost">
                    詳細
                  </Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>2025年8月</Table.Cell>
                <Table.Cell>2025/08/25</Table.Cell>
                <Table.Cell textAlign="right" fontFamily="mono" fontWeight="medium">
                  ¥398,234
                </Table.Cell>
                <Table.Cell>
                  <Button size="sm" variant="ghost">
                    詳細
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Card.Root>
      </Box>

      {/* Badges */}
      <Box>
        <Heading size="lg" mb={4}>
          Badges
        </Heading>
        <Separator mb={4} />
        <Flex gap={3} wrap="wrap">
          <Badge colorPalette="primary">Primary</Badge>
          <Badge colorPalette="secondary">Secondary</Badge>
          <Badge colorPalette="success">成功</Badge>
          <Badge colorPalette="warning">警告</Badge>
          <Badge colorPalette="danger">エラー</Badge>
          <Badge colorPalette="info">情報</Badge>
        </Flex>
      </Box>

      {/* Typography */}
      <Box>
        <Heading size="lg" mb={4}>
          Typography
        </Heading>
        <Separator mb={4} />
        <Stack gap={4}>
          <Box>
            <Heading size="4xl" mb={2}>
              Heading 4XL
            </Heading>
            <Text fontSize="xs" color="text.secondary">
              size=&quot;4xl&quot;
            </Text>
          </Box>
          <Box>
            <Heading size="3xl" mb={2}>
              Heading 3XL
            </Heading>
            <Text fontSize="xs" color="text.secondary">
              size=&quot;3xl&quot;
            </Text>
          </Box>
          <Box>
            <Heading size="2xl" mb={2}>
              Heading 2XL
            </Heading>
            <Text fontSize="xs" color="text.secondary">
              size=&quot;2xl&quot;
            </Text>
          </Box>
          <Box>
            <Heading size="xl" mb={2}>
              Heading XL
            </Heading>
            <Text fontSize="xs" color="text.secondary">
              size=&quot;xl&quot;
            </Text>
          </Box>
          <Box>
            <Heading size="lg" mb={2}>
              Heading LG
            </Heading>
            <Text fontSize="xs" color="text.secondary">
              size=&quot;lg&quot;
            </Text>
          </Box>
          <Box>
            <Text fontSize="md">
              本文テキスト（Medium）- システムの説明文や通常のテキストに使用します。
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="text.secondary">
              小さいテキスト（Small）- ラベルや補足説明に使用します。
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="text.muted">
              極小テキスト（XS）- キャプションや注釈に使用します。
            </Text>
          </Box>
        </Stack>
      </Box>

      {/* Amount Display Examples */}
      <Box>
        <Heading size="lg" mb={4}>
          Amount Display Patterns
        </Heading>
        <Separator mb={4} />
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="text.secondary" mb={2}>
                総支給額
              </Text>
              <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="primary.500">
                ¥534,199
              </Text>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="text.secondary" mb={2}>
                総控除額
              </Text>
              <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="danger.500">
                -¥127,532
              </Text>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="text.secondary" mb={2}>
                資産増加
              </Text>
              <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="success.500">
                +¥250,000
              </Text>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="text.secondary" mb={2}>
                有給残日数
              </Text>
              <Text fontSize="3xl" fontWeight="bold" fontFamily="mono" color="secondary.500">
                10.5 日
              </Text>
            </Card.Body>
          </Card.Root>
        </Grid>
      </Box>

      {/* Spacing Examples */}
      <Box>
        <Heading size="lg" mb={4}>
          Spacing System
        </Heading>
        <Separator mb={4} />
        <Stack gap={2}>
          {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((space) => (
            <Flex key={space} align="center" gap={4}>
              <Text fontSize="sm" w="60px" color="text.secondary">
                {space} ({space * 4}px)
              </Text>
              <Box h={`${space}`} bg="primary.500" borderRadius="sm" />
            </Flex>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}
