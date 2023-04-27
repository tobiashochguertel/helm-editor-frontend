import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page.tsx'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'feather-icons/dist/feather.js'
import './assets/grid.css'
import './assets/dashboard.css'
import './assets/dashboard.js'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }
]);

const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement || rootElement === null) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)