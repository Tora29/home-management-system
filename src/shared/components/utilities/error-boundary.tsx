'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

import { AlertMessage } from '../feedback/alert-message'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * エラーバウンダリコンポーネント
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <AlertMessage
          title="エラーが発生しました"
          description={this.state.error?.message || '予期しないエラーが発生しました'}
          status="error"
        />
      )
    }

    return this.props.children
  }
}