import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './pages/Layout';
import { NotFound } from './pages/NotFound';
import { Dashboard } from './pages/Dashboard';
import { Unauthorized } from './pages/Unauthorized';
import { Transactions } from './pages/Transactions';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute requiredRoles={['user', 'manager']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/transactions',
        element: (
          <ProtectedRoute requiredRoles={['user', 'manager']}>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
]);
