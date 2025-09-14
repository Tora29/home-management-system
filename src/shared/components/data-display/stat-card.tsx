'use client'

import { Card, HStack, StatDownIndicator, StatHelpText, StatLabel, StatRoot, StatUpIndicator, StatValueText, Text } from '@chakra-ui/react'

interface StatCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: string
  helpText?: string
}

/**
 * 統計カードコンポーネント
 */
export function StatCard({
  label,
  value,
  change,
  icon,
  helpText
}: StatCardProps): React.ReactElement {
  return (
    <Card.Root>
      <Card.Body>
        <StatRoot>
          <HStack justify="space-between" align="start">
            <div>
              <StatLabel>{label}</StatLabel>
              <StatValueText>
                {icon && `${icon} `}
                {value}
              </StatValueText>
              {(change || helpText) && (
                <StatHelpText>
                  {change && (
                    <>
                      {change.type === 'increase' ? (
                        <StatUpIndicator />
                      ) : (
                        <StatDownIndicator />
                      )}
                      {Math.abs(change.value)}%
                    </>
                  )}
                  {helpText && <Text as="span">{helpText}</Text>}
                </StatHelpText>
              )}
            </div>
          </HStack>
        </StatRoot>
      </Card.Body>
    </Card.Root>
  )
}