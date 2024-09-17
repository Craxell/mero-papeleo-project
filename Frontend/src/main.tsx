import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/login.tsx'
import Register from './routes/register.tsx'
import ProtectedRoute from './routes/protectedRoutes.tsx'
import Dashboard from './routes/dashboard.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/app",
    element: <App />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children:[
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
