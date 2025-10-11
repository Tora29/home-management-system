'use client'

import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/react'

/**
 * カラーパレットサンプル表示コンポーネント（開発用）
 */
export function ColorSample() {
  const colorGroups = [
    {
      name: 'Primary',
      colors: [
        { shade: '50', hex: '#e6f0ff' },
        { shade: '100', hex: '#b3d1ff' },
        { shade: '200', hex: '#80b3ff' },
        { shade: '300', hex: '#4d94ff' },
        { shade: '400', hex: '#1a75ff' },
        { shade: '500', hex: '#003672', main: true },
        { shade: '600', hex: '#002b5a' },
        { shade: '700', hex: '#002043' },
        { shade: '800', hex: '#00152c' },
        { shade: '900', hex: '#000a15' },
      ],
    },
    {
      name: 'Secondary',
      colors: [
        { shade: '50', hex: '#f0f2f5' },
        { shade: '100', hex: '#d4dae3' },
        { shade: '200', hex: '#b8c2d1' },
        { shade: '300', hex: '#9caabf' },
        { shade: '400', hex: '#7c92ad' },
        { shade: '500', hex: '#5c6f8b', main: true },
        { shade: '600', hex: '#4a5b73' },
        { shade: '700', hex: '#38475b' },
        { shade: '800', hex: '#263343' },
        { shade: '900', hex: '#14202b' },
      ],
    },
    {
      name: 'Success',
      colors: [
        { shade: '50', hex: '#f0fdf4' },
        { shade: '100', hex: '#dcfce7' },
        { shade: '200', hex: '#bbf7d0' },
        { shade: '300', hex: '#86efac' },
        { shade: '400', hex: '#4ade80' },
        { shade: '500', hex: '#38A169', main: true },
        { shade: '600', hex: '#2f855a' },
        { shade: '700', hex: '#276749' },
        { shade: '800', hex: '#22543d' },
        { shade: '900', hex: '#1c4532' },
      ],
    },
    {
      name: 'Warning',
      colors: [
        { shade: '50', hex: '#fffbeb' },
        { shade: '100', hex: '#fef3c7' },
        { shade: '200', hex: '#fde68a' },
        { shade: '300', hex: '#fcd34d' },
        { shade: '400', hex: '#fbbf24' },
        { shade: '500', hex: '#DD6B20', main: true },
        { shade: '600', hex: '#c05621' },
        { shade: '700', hex: '#9c4221' },
        { shade: '800', hex: '#7c2d12' },
        { shade: '900', hex: '#6c2810' },
      ],
    },
    {
      name: 'Danger',
      colors: [
        { shade: '50', hex: '#fff5f5' },
        { shade: '100', hex: '#fed7d7' },
        { shade: '200', hex: '#feb2b2' },
        { shade: '300', hex: '#fc8181' },
        { shade: '400', hex: '#f56565' },
        { shade: '500', hex: '#E53E3E', main: true },
        { shade: '600', hex: '#c53030' },
        { shade: '700', hex: '#9b2c2c' },
        { shade: '800', hex: '#822727' },
        { shade: '900', hex: '#63171b' },
      ],
    },
    {
      name: 'Info',
      colors: [
        { shade: '50', hex: '#ebf8ff' },
        { shade: '100', hex: '#bee3f8' },
        { shade: '200', hex: '#90cdf4' },
        { shade: '300', hex: '#63b3ed' },
        { shade: '400', hex: '#4299e1' },
        { shade: '500', hex: '#3182CE', main: true },
        { shade: '600', hex: '#2b6cb0' },
        { shade: '700', hex: '#2c5282' },
        { shade: '800', hex: '#2a4365' },
        { shade: '900', hex: '#1a365d' },
      ],
    },
  ]

  const semanticColors = [
    { name: 'Background Light', hex: '#f7fafd', usage: 'メイン背景' },
    { name: 'Background Default', hex: '#e2e7e7', usage: 'カード背景、セクション背景' },
    { name: 'Background Card', hex: '#ffffff', usage: 'カード、モーダル' },
    { name: 'Text Primary', hex: '#003672', usage: 'メインテキスト' },
    { name: 'Text Secondary', hex: '#5c6f8b', usage: 'セカンダリテキスト' },
    { name: 'Border Default', hex: '#e2e7e7', usage: 'ボーダー' },
    { name: 'Border Focus', hex: '#003672', usage: 'フォーカス時のボーダー' },
  ]

  return (
    <Stack gap={12} p={8}>
      <Box>
        <Heading size="2xl" mb={4} color="primary.500">
          Color Palette
        </Heading>
        <Text color="text.secondary" fontSize="lg">
          Silver Color Palettes - 洗練された・信頼性のある・プロフェッショナル
        </Text>
      </Box>

      {/* カラーグループ */}
      {colorGroups.map((group) => (
        <Box key={group.name}>
          <Heading size="lg" mb={4}>
            {group.name}
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={4}>
            {group.colors.map((color) => (
              <Box key={color.shade}>
                <Box
                  bg={color.hex}
                  h="80px"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  position="relative"
                >
                  {color.main && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="white"
                      px={2}
                      py={1}
                      borderRadius="sm"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      Main
                    </Box>
                  )}
                </Box>
                <Text fontSize="sm" fontWeight="medium" mt={2}>
                  {color.shade}
                </Text>
                <Text fontSize="xs" color="gray.600" fontFamily="mono">
                  {color.hex}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      ))}

      {/* セマンティックカラー */}
      <Box>
        <Heading size="lg" mb={4}>
          Semantic Colors
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {semanticColors.map((color) => (
            <Box key={color.name}>
              <Box
                bg={color.hex}
                h="100px"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={
                    color.hex === '#ffffff' || color.hex === '#f7fafd' || color.hex === '#e2e7e7'
                      ? 'gray.800'
                      : 'white'
                  }
                >
                  {color.name}
                </Text>
              </Box>
              <Text fontSize="sm" fontWeight="medium" mt={2}>
                {color.name}
              </Text>
              <Text fontSize="xs" color="gray.600" fontFamily="mono">
                {color.hex}
              </Text>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {color.usage}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* 金額表示サンプル */}
      <Box>
        <Heading size="lg" mb={4}>
          Amount Display
        </Heading>
        <Stack gap={4}>
          <Box p={4} bg="bg.card" borderRadius="md" border="1px solid" borderColor="border.default">
            <Text fontSize="2xl" fontFamily="mono" color="amount.positive">
              +¥250,000
            </Text>
            <Text fontSize="sm" color="text.secondary">
              プラス値（資産増加）
            </Text>
          </Box>
          <Box p={4} bg="bg.card" borderRadius="md" border="1px solid" borderColor="border.default">
            <Text fontSize="2xl" fontFamily="mono" color="amount.negative">
              -¥50,000
            </Text>
            <Text fontSize="sm" color="text.secondary">
              マイナス値（控除項目）
            </Text>
          </Box>
          <Box p={4} bg="bg.card" borderRadius="md" border="1px solid" borderColor="border.default">
            <Text fontSize="2xl" fontFamily="mono" color="amount.neutral">
              ¥406,667
            </Text>
            <Text fontSize="sm" color="text.secondary">
              中立値（通常表示）
            </Text>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
