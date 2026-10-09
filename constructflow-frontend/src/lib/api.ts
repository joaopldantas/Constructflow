import axios, { AxiosError } from 'axios'
import type { ApiErrorBody } from '@/types/api'
import { tokenStorage } from './token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // A API responde 401 para token inválido/expirado.
    if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth')) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export class ApiError extends Error {
  readonly status: number | undefined
  readonly fieldErrors: Record<string, string>

  constructor(message: string, status?: number, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function toApiError(error: unknown, fallback = 'Ocorreu um erro inesperado.'): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return new ApiError('Não foi possível conectar à API. Verifique se ela está em execução.')
    }
    const { status, data } = error.response
    if (status === 403) {
      return new ApiError(data?.message && data.message !== 'Access denied.'
        ? data.message
        : 'Você não tem permissão para realizar esta ação.', status)
    }
    return new ApiError(data?.message || fallback, status, data?.validationErrors ?? {})
  }
  return new ApiError(fallback)
}
