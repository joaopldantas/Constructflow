const STORAGE_KEY = 'constructflow.token'

interface JwtPayload {
  sub: string
  exp: number
  iat: number
}

export const tokenStorage = {
  get: () => localStorage.getItem(STORAGE_KEY),
  set: (token: string) => localStorage.setItem(STORAGE_KEY, token),
  clear: () => localStorage.removeItem(STORAGE_KEY),
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenValid(token: string | null): token is string {
  if (!token) return false
  const payload = decodeToken(token)
  return !!payload && payload.exp * 1000 > Date.now()
}
