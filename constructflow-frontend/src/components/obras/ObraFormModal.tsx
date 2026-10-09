import { useEffect } from 'react'
import { Button, FormAlert, InputField, Modal, SelectField } from '@/components/ui'
import { useAtualizarObra, useCriarObra, useUsuarios } from '@/hooks/queries'
import { useFormState } from '@/hooks/useFormState'
import { useToast } from '@/hooks/useToast'
import { STATUS_OBRA_LABEL } from '@/lib/constants'
import { CEP_REGEX, formatarCep } from '@/lib/format'
import type { Obra, StatusObra } from '@/types/api'

interface ObraFormModalProps {
  open: boolean
  obra?: Obra | null
  onClose: () => void
}

const VAZIO = { nome: '', endereco: '', cep: '', status: 'PLANEJADA', responsavelId: '' }

// Na criação a API aceita PLANEJADA ou EM_ANDAMENTO como ponto de partida razoável;
// as demais transições passam pela máquina de estados (PATCH /obras/{id}/status).
const STATUS_INICIAIS: StatusObra[] = ['PLANEJADA', 'EM_ANDAMENTO']

export function ObraFormModal({ open, obra, onClose }: ObraFormModalProps) {
  const editando = !!obra
  const { notify } = useToast()
  const { data: usuarios = [] } = useUsuarios()
  const criar = useCriarObra()
  const atualizar = useAtualizarObra()
  const form = useFormState(VAZIO)
  const { values, errors, onChange, setField, setErrors, reset, applyApiError } = form

  const engenheiros = usuarios.filter((u) => u.papel === 'ENGENHEIRO')

  useEffect(() => {
    if (!open) return
    reset(
      obra
        ? {
            nome: obra.nome,
            endereco: obra.endereco,
            cep: obra.cep ?? '',
            status: obra.status,
            responsavelId: obra.responsavelId?.toString() ?? '',
          }
        : VAZIO,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, obra])

  function validar() {
    const e: Partial<Record<keyof typeof VAZIO, string>> = {}
    if (!values.nome.trim()) e.nome = 'Informe o nome da obra.'
    if (!values.endereco.trim()) e.endereco = 'Informe o endereço.'
    if (!CEP_REGEX.test(values.cep)) e.cep = 'Use o formato 00000-000.'
    if (!values.responsavelId) e.responsavelId = 'Selecione o engenheiro responsável.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validar()) return
    const base = {
      nome: values.nome.trim(),
      endereco: values.endereco.trim(),
      cep: values.cep,
      responsavelId: Number(values.responsavelId),
    }
    try {
      if (editando) {
        await atualizar.mutateAsync({ id: obra.id, dados: base })
        notify('Obra atualizada.')
      } else {
        await criar.mutateAsync({ ...base, status: values.status as StatusObra })
        notify('Obra cadastrada.')
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
      title={editando ? 'Editar obra' : 'Nova obra'}
      description={editando ? undefined : 'Cadastre uma obra e defina o engenheiro responsável.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={salvando}>
            Cancelar
          </Button>
          <Button type="submit" form="obra-form" loading={salvando}>
            {editando ? 'Salvar alterações' : 'Cadastrar obra'}
          </Button>
        </>
      }
    >
      <form id="obra-form" className="form-grid" onSubmit={onSubmit} noValidate>
        <FormAlert message={form.formError} />
        <InputField label="Nome" name="nome" value={values.nome} onChange={onChange} error={errors.nome} />
        <InputField
          label="Endereço"
          name="endereco"
          value={values.endereco}
          onChange={onChange}
          error={errors.endereco}
        />
        <div className="form-row">
          <InputField
            label="CEP"
            name="cep"
            inputMode="numeric"
            placeholder="00000-000"
            value={values.cep}
            onChange={(e) => setField('cep', formatarCep(e.target.value))}
            error={errors.cep}
          />
          {!editando && (
            <SelectField
              label="Status inicial"
              name="status"
              value={values.status}
              onChange={onChange}
              options={STATUS_INICIAIS.map((s) => ({ value: s, label: STATUS_OBRA_LABEL[s] }))}
            />
          )}
        </div>
        <SelectField
          label="Engenheiro responsável"
          name="responsavelId"
          value={values.responsavelId}
          onChange={onChange}
          error={errors.responsavelId}
          placeholder={engenheiros.length ? 'Selecione' : 'Nenhum engenheiro cadastrado'}
          hint={engenheiros.length ? undefined : 'Cadastre um usuário com papel Engenheiro primeiro.'}
          options={engenheiros.map((u) => ({ value: String(u.id), label: `${u.nome} · ${u.email}` }))}
        />
      </form>
    </Modal>
  )
}
