'use client'

import { Box } from '@chakra-ui/react'

interface QRCodeProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
}

/**
 * QRコードコンポーネント（プレースホルダー実装）
 */
export function QRCode({ value, size = 200, bgColor = 'white', fgColor = 'black' }: QRCodeProps): React.ReactElement {
  // 実際のQRコード生成にはqrcode.jsなどのライブラリが必要
  return (
    <Box
      w={size}
      h={size}
      bg={bgColor}
      color={fgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="2px solid"
      borderColor={fgColor}
      fontSize="xs"
      textAlign="center"
      p={2}
    >
      QR Code for: {value}
    </Box>
  )
}