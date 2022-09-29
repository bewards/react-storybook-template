import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react'

interface State {
  hasError: boolean
  lastError: Error | null
}

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = {
    hasError: false,
    lastError: null,
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, lastError: error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render(): ReactNode {
    const { lastError, hasError } = this.state
    const { children } = this.props

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Something went wrong.</h1>
          {lastError && <p>{lastError.message}</p>}
        </>
      )
    }

    return children
  }
}
