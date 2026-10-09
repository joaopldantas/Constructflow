import { useContext } from 'react'
import { AuthContext } from '@/contexts/auth-context'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return context
}

/** Usuário autenticado — use apenas em rotas protegidas. */
export function useUsuarioLogado() {
  const { usuario } = useAuth()
  if (!usuario) throw new Error('Nenhum usuário autenticado')
  return usuario
}
