'use client'

import { Box, Container, Heading, Text, Button, Flex } from '@chakra-ui/react'

/**
 * ホームページ
 */
export default function Home(): JSX.Element {
  return (
    <Container maxW="6xl" py="10">
      <Flex direction="column" gap="8">
        <Box textAlign="center" py="10">
          <Heading size="4xl" mb="4">
            Home Management System
          </Heading>
          <Text fontSize="xl" color="gray.600">
            家庭内在庫管理システム
          </Text>
        </Box>

        <Box bg="white" p="8" borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor="gray.200">
          <Flex direction="column" gap="6">
            <Heading size="xl">
              システムの特徴
            </Heading>
            <Text fontSize="lg">
              このシステムは、家庭内の在庫を効率的に管理し、買い物リストの作成や期限管理を支援します。
            </Text>
            <Flex gap="4" wrap="wrap">
              <Button colorPalette="blue" size="lg">
                在庫を確認
              </Button>
              <Button variant="outline" colorPalette="blue" size="lg">
                買い物リストを作成
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}
