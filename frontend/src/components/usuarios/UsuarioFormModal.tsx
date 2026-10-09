import { useEffect } from 'react'
import { Button, FormAlert, InputField, Modal, SelectField } from '@/components/ui'
import { useAtualizarUsuario, useCriarUsuario } from '@/hooks/queries'
import { useFormState } from '@/hooks/useFormState'
import { useToast } from '@/hooks/useToast'
import { PAPEIS, PAPEL_LABEL } from '@/lib/constants'
import { EMAIL_REGEX } from '@/lib/format'
import type { AtualizarUsuarioRequest, Papel, Usuario } from '@/types/api'

interface UsuarioFormModalProps {
  open: boolean
  usuario?: Usuario | null
  onClose: () => void
}

const VAZIO = { nome: '', email: '', senha: '', papel: 'ENGENHEIRO' }

export function UsuarioFormModal({ open, usuario, onClose }: UsuarioFormModalProps) {
  const editando = !!usuario
  const { notify } = useToast()
  const criar = useCriarUsuario()
  const atualizar = useAtualizarUsuario()
  const form = useFormState(VAZIO)
  const { values, errors, onChange, setErrors, reset, applyApiError } = form

  useEffect(() => {
    if (!open) return
    reset(usuario ? { nome: usuario.nome, email: usuario.email, senha: '', papel: usuario.papel } : VAZIO)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, usuario])

  function validar() {
    const e: Partial<Record<keyof typeof VAZIO, string>> = {}
    if (!values.nome.trim()) e.nome = 'Informe o nome.'
    if (!EMAIL_REGEX.test(values.email.trim())) e.email = 'Informe um email válido.'
    if (!editando && values.senha.length < 6) e.senha = 'A senha precisa ter ao menos 6 caracteres.'
    if (editando && values.senha && values.senha.length < 6) e.senha = 'A senha precisa ter ao menos 6 caracteres.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validar()) return
    try {
      if (editando) {
        const dados: AtualizarUsuarioRequest = {
          nome: values.nome.trim(),
          email: values.email.trim(),
          papel: values.papel as Papel,
          ...(values.senha ? { senha: values.senha } : {}),
        }
        await atualizar.mutateAsync({ id: usuario.id, dados })
        notify('Usuário atualizado.')
      } else {
        await criar.mutateAsync({
          nome: values.nome.trim(),
          email: values.email.trim(),
          senha: values.senha,
          papel: values.papel as Papel,
        })
        notify('Usuário cadastrado.')
      }
      onClose()
    } catch (error) {
      applyApiError(error)
    }
  }

  const salvando = criar.isPending || atualizar.isPending

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar usuário' : 'Novo usuário'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>
            Cancelar
          </Button>
          <Button type="submit" form="usuario-form" loading={salvando}>
            {editando ? 'Salvar alterações' : 'Cadastrar usuário'}
          </Button>
        </>
      }
    >
      <form id="usuario-form" className="form-grid" onSubmit={onSubmit} noValidate>
        <FormAlert message={form.formError} />
        <InputField label="Nome" name="nome" value={values.nome} onChange={onChange} error={errors.nome} />
        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="off"
          value={values.email}
          onChange={onChange}
          error={errors.email}
        />
        <div className="form-row">
          <InputField
            label={editando ? 'Nova senha' : 'Senha inicial'}
            name="senha"
            type="password"
            autoComplete="new-password"
            value={values.senha}
            onChange={onChange}
            error={errors.senha}
            hint={editando ? 'Deixe em branco para manter.' : 'Mínimo de 6 caracteres.'}
          />
          <SelectField
            label="Papel"
            name="papel"
            value={values.papel}
            onChange={onChange}
            options={PAPEIS.map((p) => ({ value: p, label: PAPEL_LABEL[p] }))}
          />
        </div>
      </form>
    </Modal>
  )
}
