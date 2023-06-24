import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { RouterProvider } from '@tanstack/router'
import { router } from '@/router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position="bottom-right" />
      <RouterProvider router={router} />
      <TanStackRouterDevtools position="bottom-left" router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
