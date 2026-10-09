import { api } from '@/lib/api'

export interface Credenciais {
  email: string
  senha: string
}

export const authService = {
  /** A API devolve o JWT como texto puro. */
  login: (credenciais: Credenciais) =>
    api.post<string>('/auth/login', credenciais, { responseType: 'text' }).then((r) => r.data),
}
