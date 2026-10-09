import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import type { Usuario } from '@/types/api'

export function ProtectedRoute() {
  const { usuario, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <PageLoader />
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { usuario, carregando } = useAuth()
  if (carregando) return <PageLoader />
  return usuario ? <Navigate to="/" replace /> : <Outlet />
}

export function PermissionRoute({ allow }: { allow: (usuario: Usuario) => boolean }) {
  const { usuario } = useAuth()
  return usuario && allow(usuario) ? <Outlet /> : <Navigate to="/" replace />
}
