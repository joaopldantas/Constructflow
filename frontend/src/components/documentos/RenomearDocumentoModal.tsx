import { useEffect } from 'react'
import { Button, FormAlert, InputField, Modal } from '@/components/ui'
import { useRenomearDocumento } from '@/hooks/queries'
import { useFormState } from '@/hooks/useFormState'
import { useToast } from '@/hooks/useToast'
import type { Documento } from '@/types/api'

export function RenomearDocumentoModal({ documento, onClose }: { documento: Documento | null; onClose: () => void }) {
  const { notify } = useToast()
  const renomear = useRenomearDocumento()
  const form = useFormState({ nome: '' })

  useEffect(() => {
    if (documento) form.reset({ nome: documento.nome })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documento])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!documento) return
    if (!form.values.nome.trim()) {
      form.setErrors({ nome: 'Informe o nome.' })
      return
    }
    try {
      await renomear.mutateAsync({ id: documento.id, nome: form.values.nome.trim() })
      notify('Documento renomeado.')
      onClose()
    } catch (error) {
      form.applyApiError(error)
    }
  }

  return (
    <Modal
      open={!!documento}
      onClose={onClose}
      title="Renomear documento"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={renomear.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="renomear-form" loading={renomear.isPending}>
            Salvar
          </Button>
        </>
      }
    >
      <form id="renomear-form" className="form-grid" onSubmit={onSubmit} noValidate>
        <FormAlert message={form.formError} />
        <InputField label="Nome" name="nome" value={form.values.nome} onChange={form.onChange} error={form.errors.nome} />
      </form>
    </Modal>
  )
}
