import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

import { getMasterData } from '@/features/inventory-registration/api/queries'
import { ItemRegistrationForm } from '@/features/inventory-registration/ui/ItemRegistrationForm'

/**
 * 在庫アイテム登録ページ
 */
export default async function InventoryRegisterPage(): Promise<React.ReactElement> {
  // マスターデータを取得
  const { categories, units, locations } = await getMasterData()

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            在庫アイテム登録
          </Heading>
          <Text color="gray.600">新しい在庫アイテムを登録します</Text>
        </Box>

        <ItemRegistrationForm categories={categories} units={units} locations={locations} />
      </VStack>
    </Container>
  )
}
