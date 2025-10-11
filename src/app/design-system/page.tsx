import { Box, Tabs } from '@chakra-ui/react'
import { ColorSample } from '@/shared/components/dev/ColorSample'
import { ComponentSample } from '@/shared/components/dev/ComponentSample'

/**
 * デザインシステム確認ページ（開発用）
 *
 * カラーパレット・コンポーネントサンプルの確認に使用
 * 本番環境では削除または非公開にする
 */
export default function DesignSystemPage() {
  return (
    <Box>
      <Tabs.Root defaultValue="colors" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="colors">Colors</Tabs.Trigger>
          <Tabs.Trigger value="components">Components</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="colors">
          <ColorSample />
        </Tabs.Content>
        <Tabs.Content value="components">
          <ComponentSample />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  )
}
