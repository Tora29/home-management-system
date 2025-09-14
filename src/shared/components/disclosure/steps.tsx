'use client'

import { StepsCompletedContent, StepsContent, StepsIndicator, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot, StepsStatus, StepsTrigger } from '@chakra-ui/react'

interface Step {
  title: string
  description?: string
  content?: React.ReactNode
}

interface StepsProps {
  steps: Step[]
  activeStep?: number
  onStepChange?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
}

/**
 * ステップコンポーネント
 */
export function Steps({ steps, activeStep = 0, onStepChange, orientation = 'horizontal' }: StepsProps): React.ReactElement {
  return (
    <StepsRoot step={activeStep} onStepChange={(details) => onStepChange?.(details.step)} orientation={orientation}>
      <StepsList>
        {steps.map((step, index) => (
          <StepsItem key={index} index={index}>
            <StepsTrigger>
              <StepsIndicator>
                <StepsStatus complete="✓" incomplete={String(index + 1)} current={String(index + 1)} />
              </StepsIndicator>
              <span>{step.title}</span>
            </StepsTrigger>
            {step.content && <StepsContent>{step.content}</StepsContent>}
          </StepsItem>
        ))}
      </StepsList>
      <StepsCompletedContent>すべて完了しました！</StepsCompletedContent>
      <div>
        <StepsPrevTrigger>前へ</StepsPrevTrigger>
        <StepsNextTrigger>次へ</StepsNextTrigger>
      </div>
    </StepsRoot>
  )
}