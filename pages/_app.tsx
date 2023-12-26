import { withBlitz } from "app/blitz-client"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"

import { AppProps, ErrorBoundary, ErrorFallbackProps, ErrorComponent } from "@blitzjs/next"

import LoginForm from "app/auth/components/LoginForm"

import "app/core/styles/index.css"
import { AuthenticationError, AuthorizationError } from "blitz"

export default withBlitz(function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        onReset={useQueryErrorResetBoundary().reset}
      >
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </>
  )
})

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
