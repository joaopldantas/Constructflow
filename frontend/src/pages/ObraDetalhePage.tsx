import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, FilePlus2, FileText, Pencil, Trash2 } from 'lucide-react'
import { DocumentoFormModal } from '@/components/documentos/DocumentoFormModal'
import { DocumentosTable } from '@/components/documentos/DocumentosTable'
import { ObraFormModal } from '@/components/obras/ObraFormModal'
import {
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  PageHeader,
  PageLoader,
  StatusObraBadge,
} from '@/components/ui'
import {
  useAtualizarStatusObra,
  useDocumentosDaObra,
  useExcluirObra,
  useObra,
  useUsuariosPorId,
} from '@/hooks/queries'
import { useUsuarioLogado } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useToast } from '@/hooks/useToast'
import { toApiError } from '@/lib/api'
import { STATUS_OBRA_LABEL, proximosStatusObra } from '@/lib/constants'
import { can } from '@/lib/permissions'
import type { StatusObra } from '@/types/api'

export function ObraDetalhePage() {
  const id = Number(useParams().id)
  const usuario = useUsuarioLogado()
  const navigate = useNavigate()
  const { notify } = useToast()
  const obra = useObra(id)
  const documentos = useDocumentosDaObra(id)
  const usuariosPorId = useUsuariosPorId()
  const atualizarStatus = useAtualizarStatusObra()
  const excluir = useExcluirObra()
  const [editando, setEditando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [novoDocumento, setNovoDocumento] = useState(false)
  const [statusConfirmar, setStatusConfirmar] = useState<StatusObra | null>(null)

  useDocumentTitle(obra.data?.nome ?? 'Obra')

  if (obra.isPending) return <PageLoader />
  if (obra.isError) {
    const status = toApiError(obra.error).status
    return (
      <EmptyState
        icon={<FileText />}
        title={status === 404 ? 'Obra não encontrada' : 'Não foi possível carregar a obra'}
        action={
          <Link to="/obras" className="link-btn">
            Voltar para obras
          </Link>
        }
      />
    )
  }

  const dados = obra.data
  const responsavel = dados.responsavelId ? usuariosPorId.get(dados.responsavelId) : undefined
  const transicoes = can.alterarStatusObra(usuario, dados) ? proximosStatusObra(dados.status) : []

  async function mudarStatus(status: StatusObra) {
    try {
      await atualizarStatus.mutateAsync({ id, status })
      notify(`Status alterado para ${STATUS_OBRA_LABEL[status]}.`)
      setStatusConfirmar(null)
    } catch (error) {
      notify(toApiError(error).message, 'error')
    }
  }

  async function confirmarExclusao() {
    try {
      await excluir.mutateAsync(id)
      notify('Obra excluída.')
      navigate('/obras', { replace: true })
    } catch (error) {
      notify(toApiError(error).message, 'error')
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={
          <Link to="/obras" className="breadcrumb">
            <ChevronLeft size={14} /> Obras
          </Link>
        }
        title={dados.nome}
        actions={
          <>
            {can.editarObra(usuario) && (
              <Button variant="secondary" icon={<Pencil size={16} />} onClick={() => setEditando(true)}>
                Editar
              </Button>
            )}
            {can.excluirObra(usuario) && (
              <Button variant="ghost" icon={<Trash2 size={16} />} onClick={() => setConfirmandoExclusao(true)}>
                Excluir
              </Button>
            )}
          </>
        }
      />

      <section className="card detail-card">
        <dl className="detail-list">
          <div>
            <dt>Status</dt>
            <dd>
              <StatusObraBadge status={dados.status} />
            </dd>
          </div>
          <div>
            <dt>Endereço</dt>
            <dd>{dados.endereco}</dd>
          </div>
          <div>
            <dt>CEP</dt>
            <dd>{dados.cep ?? '—'}</dd>
          </div>
          <div>
            <dt>Responsável</dt>
            <dd>{responsavel ? `${responsavel.nome} (${responsavel.email})` : '—'}</dd>
          </div>
        </dl>

        {transicoes.length > 0 && (
          <div className="detail-card__actions">
            <span className="text-muted">Avançar status:</span>
            {transicoes.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={status === 'CANCELADA' ? 'ghost' : 'secondary'}
                onClick={() => setStatusConfirmar(status)}
              >
                {STATUS_OBRA_LABEL[status]}
              </Button>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <header className="card__header">
          <h2>Documentos</h2>
          <Button size="sm" icon={<FilePlus2 size={16} />} onClick={() => setNovoDocumento(true)}>
            Adicionar
          </Button>
        </header>
        {documentos.isPending ? (
          <PageLoader />
        ) : documentos.isError ? (
          <ErrorState message="Não foi possível carregar os documentos." onRetry={documentos.refetch} />
        ) : documentos.data.length === 0 ? (
          <EmptyState icon={<FileText />} title="Nenhum documento" description="Adicione orçamentos, contratos, projetos e relatórios desta obra." />
        ) : (
          <DocumentosTable documentos={documentos.data} obra={dados} />
        )}
      </section>

      <ObraFormModal open={editando} obra={dados} onClose={() => setEditando(false)} />
      <DocumentoFormModal open={novoDocumento} obraId={id} onClose={() => setNovoDocumento(false)} />
      <ConfirmDialog
        open={confirmandoExclusao}
        title="Excluir obra"
        message="A obra e todos os seus documentos serão removidos permanentemente."
        loading={excluir.isPending}
        onConfirm={confirmarExclusao}
        onClose={() => setConfirmandoExclusao(false)}
      />
      <ConfirmDialog
        open={!!statusConfirmar}
        title="Alterar status"
        message={
          statusConfirmar
            ? `Mover a obra para "${STATUS_OBRA_LABEL[statusConfirmar]}"? ${
                statusConfirmar === 'FINALIZADA' || statusConfirmar === 'CANCELADA'
                  ? 'Este status é final e não poderá ser alterado depois.'
                  : ''
              }`
            : ''
        }
        confirmLabel="Confirmar"
        loading={atualizarStatus.isPending}
        onConfirm={() => statusConfirmar && mudarStatus(statusConfirmar)}
        onClose={() => setStatusConfirmar(null)}
      />
    </>
  )
}
