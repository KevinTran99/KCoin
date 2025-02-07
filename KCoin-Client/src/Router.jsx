import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './pages/Layout';
import { NotFound } from './pages/NotFound';
import { Blockchain } from './pages/Blockchain';
import { Unauthorized } from './pages/Unauthorized';
import { Transactions } from './pages/Transactions';
import { Mine } from './pages/Mine';
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
        path: '/blockchain',
        element: (
          <ProtectedRoute requiredRoles={['user', 'manager']}>
            <Blockchain />
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
        path: '/mine',
        element: (
          <ProtectedRoute requiredRoles={['user', 'manager']}>
            <Mine />
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
