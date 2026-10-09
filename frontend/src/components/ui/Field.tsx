import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

interface FieldWrapperProps {
  label: string
  error?: string
  hint?: string
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

function FieldWrapper({ label, error, hint, children }: FieldWrapperProps) {
  const id = useId()
  const messageId = `${id}-msg`
  const message = error ?? hint
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {children({ id, describedBy: message ? messageId : undefined, invalid: !!error })}
      {message && (
        <p id={messageId} className={error ? 'field__error' : 'field__hint'}>
          {message}
        </p>
      )}
    </div>
  )
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function InputField({ label, error, hint, ...rest }: InputFieldProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <input id={id} className="input" aria-invalid={invalid} aria-describedby={describedBy} {...rest} />
      )}
    </FieldWrapper>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({ label, error, hint, options, placeholder, ...rest }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <select id={id} className="input" aria-invalid={invalid} aria-describedby={describedBy} {...rest}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldWrapper>
  )
}
