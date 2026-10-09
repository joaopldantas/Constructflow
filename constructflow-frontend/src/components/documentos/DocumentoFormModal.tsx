import { useEffect } from 'react'
import { Button, FormAlert, InputField, Modal, SelectField } from '@/components/ui'
import { useCriarDocumento, useObras } from '@/hooks/queries'
import { useFormState } from '@/hooks/useFormState'
import { useToast } from '@/hooks/useToast'
import { TIPOS_DOCUMENTO, TIPO_DOCUMENTO_LABEL } from '@/lib/constants'
import type { TipoDocumento } from '@/types/api'

interface DocumentoFormModalProps {
  open: boolean
  onClose: () => void
  /** Quando informado, o documento é vinculado a essa obra e o seletor fica oculto. */
  obraId?: number
}

const VAZIO = { nome: '', tipo: 'PROJETO', caminhoArquivo: '', obraId: '' }

export function DocumentoFormModal({ open, onClose, obraId }: DocumentoFormModalProps) {
  const { notify } = useToast()
  const { data: obras = [] } = useObras()
  const criar = useCriarDocumento()
  const form = useFormState(VAZIO)
  const { values, errors, onChange, setErrors, reset, applyApiError } = form

  useEffect(() => {
    if (open) reset({ ...VAZIO, obraId: obraId ? String(obraId) : '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, obraId])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const e: Partial<Record<keyof typeof VAZIO, string>> = {}
    if (!values.nome.trim()) e.nome = 'Informe o nome do documento.'
    if (!values.obraId) e.obraId = 'Selecione a obra.'
    setErrors(e)
    if (Object.keys(e).length) return

    try {
      await criar.mutateAsync({
        nome: values.nome.trim(),
        tipo: values.tipo as TipoDocumento,
        status: 'PENDENTE',
        caminhoArquivo: values.caminhoArquivo.trim() || undefined,
        obraId: Number(values.obraId),
      })
      notify('Documento enviado para análise.')
      onClose()
    } catch (error) {
      applyApiError(error)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo documento"
      description="O documento entra como pendente até ser avaliado."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={criar.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="documento-form" loading={criar.isPending}>
            Adicionar documento
          </Button>
        </>
      }
    >
      <form id="documento-form" className="form-grid" onSubmit={onSubmit} noValidate>
        <FormAlert message={form.formError} />
        <InputField label="Nome" name="nome" value={values.nome} onChange={onChange} error={errors.nome} />
        <SelectField
          label="Tipo"
          name="tipo"
          value={values.tipo}
          onChange={onChange}
          options={TIPOS_DOCUMENTO.map((t) => ({ value: t, label: TIPO_DOCUMENTO_LABEL[t as TipoDocumento] }))}
        />
        {!obraId && (
          <SelectField
            label="Obra"
            name="obraId"
            value={values.obraId}
            onChange={onChange}
            error={errors.obraId}
            placeholder="Selecione"
            options={obras.map((o) => ({ value: String(o.id), label: o.nome }))}
          />
        )}
        <InputField
          label="Link ou caminho do arquivo"
          name="caminhoArquivo"
          value={values.caminhoArquivo}
          onChange={onChange}
          placeholder="https://… ou /projetos/planta-baixa.pdf"
          hint="Opcional. A API ainda não faz upload de arquivos, apenas guarda a referência."
        />
      </form>
    </Modal>
  )
}
