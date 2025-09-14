'use client'

import { Box, Collapse, HStack, IconButton, VStack } from '@chakra-ui/react'
import { useState } from 'react'

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

interface TreeViewProps {
  data: TreeNode[]
  onSelect?: (node: TreeNode) => void
}

/**
 * ツリービューコンポーネント
 */
export function TreeView({ data, onSelect }: TreeViewProps): React.ReactElement {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const toggleNode = (nodeId: string): void => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: TreeNode, level: number = 0): React.ReactElement => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)

    return (
      <Box key={node.id}>
        <HStack
          pl={level * 4}
          py={1}
          cursor="pointer"
          _hover={{ bg: 'gray.50' }}
          onClick={() => onSelect?.(node)}
        >
          {hasChildren && (
            <IconButton
              aria-label="Toggle"
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.id)
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </IconButton>
          )}
          {!hasChildren && <Box w={6} />}
          <Box>{node.label}</Box>
        </HStack>
        {hasChildren && (
          <Collapse in={isExpanded}>
            <VStack align="stretch" spacing={0}>
              {node.children!.map((child) => renderNode(child, level + 1))}
            </VStack>
          </Collapse>
        )}
      </Box>
    )
  }

  return (
    <VStack align="stretch" spacing={0}>
      {data.map((node) => renderNode(node))}
    </VStack>
  )
}