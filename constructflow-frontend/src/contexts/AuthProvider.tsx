import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { setUnauthorizedHandler } from '@/lib/api'
import { decodeToken, isTokenValid, tokenStorage } from '@/lib/token'
import { authService, type Credenciais } from '@/services/auth.service'
import { usuariosService } from '@/services/usuarios.service'
import type { Usuario } from '@/types/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(() => isTokenValid(tokenStorage.get()))

  const sair = useCallback(() => {
    tokenStorage.clear()
    setUsuario(null)
    queryClient.clear()
  }, [queryClient])

  const buscarUsuario = useCallback(async (token: string) => {
    const email = decodeToken(token)?.sub
    if (!email) throw new Error('Token inválido')
    return usuariosService.buscarPorEmail(email)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(sair)
    return () => setUnauthorizedHandler(null)
  }, [sair])

  // Restaura a sessão a partir do token salvo.
  useEffect(() => {
    const token = tokenStorage.get()
    if (!isTokenValid(token)) {
      tokenStorage.clear()
      return
    }
    buscarUsuario(token)
      .then(setUsuario)
      .catch(sair)
      .finally(() => setCarregando(false))
  }, [buscarUsuario, sair])

  // Encerra a sessão quando o JWT expira.
  useEffect(() => {
    const token = tokenStorage.get()
    const exp = token ? decodeToken(token)?.exp : undefined
    if (!usuario || !exp) return
    const timeout = window.setTimeout(sair, Math.max(exp * 1000 - Date.now(), 0))
    return () => window.clearTimeout(timeout)
  }, [usuario, sair])

  const entrar = useCallback(
    async (credenciais: Credenciais) => {
      const token = await authService.login(credenciais)
      tokenStorage.set(token)
      try {
        setUsuario(await buscarUsuario(token))
      } catch (error) {
        tokenStorage.clear()
        throw error
      }
    },
    [buscarUsuario],
  )

  const value = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
