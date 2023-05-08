// import './userWorker'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'feather-icons/dist/feather.js'
import './assets/grid.css'
import './assets/dashboard.css'
import './assets/wasm_exec.js'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page.tsx'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GeistProvider } from '@geist-ui/core'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }
]);

const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement || rootElement === null) throw new Error('Failed to find the root element');
const queryClient = new QueryClient()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GeistProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GeistProvider>
  </React.StrictMode>,
)