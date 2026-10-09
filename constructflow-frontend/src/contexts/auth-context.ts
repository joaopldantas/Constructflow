import { createContext } from 'react'
import type { Usuario } from '@/types/api'
import type { Credenciais } from '@/services/auth.service'

export interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  entrar: (credenciais: Credenciais) => Promise<void>
  sair: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
