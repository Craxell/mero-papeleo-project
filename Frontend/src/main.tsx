import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/login.tsx'
import Register from './routes/register.tsx'
import ProtectedRoute from './routes/protectedRoutes.tsx'
import Dashboard from './routes/dashboard.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import LandingPage from './routes/landingPage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
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