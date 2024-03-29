import 'bootstrap/dist/css/bootstrap.min.css'
import 'feather-icons/dist/feather.js'
import './assets/grid.css'
import './assets/dashboard.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GeistProvider } from '@geist-ui/core'

import App from './App'
import ErrorPage from './components/Error/error-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/*',
        element: <App />,
      }
    ]
  }
]);

const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement || rootElement === null) throw new Error('Failed to find the root element');
const queryClient = new QueryClient()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GeistProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GeistProvider>
  </React.StrictMode>,
)