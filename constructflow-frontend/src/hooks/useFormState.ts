import { useState, type ChangeEvent } from 'react'
import { toApiError } from '@/lib/api'

/** Estado de formulário simples com erros por campo vindos da validação local ou da API. */
export function useFormState<T extends Record<string, string>>(inicial: T) {
  const [values, setValues] = useState<T>(inicial)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setField(name as keyof T, value)
  }

  function setField(name: keyof T, value: string) {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  function reset(next: T = inicial) {
    setValues(next)
    setErrors({})
    setFormError(null)
  }

  /** Aplica um erro da API: erros de campo vão para o campo, o resto vira mensagem do formulário. */
  function applyApiError(error: unknown) {
    const apiError = toApiError(error)
    const fieldErrors = apiError.fieldErrors as Partial<Record<keyof T, string>>
    setErrors(fieldErrors)
    setFormError(Object.keys(fieldErrors).length ? null : apiError.message)
  }

  return { values, errors, formError, onChange, setField, setErrors, setFormError, reset, applyApiError }
}
