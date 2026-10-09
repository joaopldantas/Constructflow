export function formatarCep(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8)
  return digitos.length <= 5 ? digitos : `${digitos.slice(0, 5)}-${digitos.slice(5)}`
}

export const CEP_REGEX = /^\d{5}-\d{3}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function formatarDataHora(iso: string | null | undefined): string {
  if (!iso) return '—'
  const data = new Date(iso)
  return Number.isNaN(data.getTime()) ? '—' : dataHora.format(data)
}

export function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]!.toUpperCase())
    .join('')
}
