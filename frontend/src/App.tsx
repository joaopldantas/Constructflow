import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PermissionRoute, ProtectedRoute, PublicOnlyRoute } from '@/components/layout/RouteGuards'
import { can } from '@/lib/permissions'
import { DashboardPage } from '@/pages/DashboardPage'
import { DocumentosPage } from '@/pages/DocumentosPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ObraDetalhePage } from '@/pages/ObraDetalhePage'
import { ObrasPage } from '@/pages/ObrasPage'
import { UsuariosPage } from '@/pages/UsuariosPage'

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'obras', element: <ObrasPage /> },
          { path: 'obras/:id', element: <ObraDetalhePage /> },
          { path: 'documentos', element: <DocumentosPage /> },
          {
            element: <PermissionRoute allow={can.gerenciarUsuarios} />,
            children: [{ path: 'usuarios', element: <UsuariosPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
