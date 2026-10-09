import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ExternalLink, Pencil, Trash2, X } from 'lucide-react'
import { ConfirmDialog, StatusDocumentoBadge } from '@/components/ui'
import { useAtualizarStatusDocumento, useExcluirDocumento } from '@/hooks/queries'
import { useUsuarioLogado } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { toApiError } from '@/lib/api'
import { TIPO_DOCUMENTO_LABEL } from '@/lib/constants'
import { formatarDataHora } from '@/lib/format'
import { can } from '@/lib/permissions'
import type { Documento, Obra, StatusDocumento } from '@/types/api'
import { RenomearDocumentoModal } from './RenomearDocumentoModal'

interface DocumentosTableProps {
  documentos: Documento[]
  /** Quando informado, exibe a coluna "Obra" com link. */
  obrasPorId?: Map<number, Obra>
  /** Obra dos documentos, quando todos pertencem à mesma (tela de detalhe). */
  obra?: Obra
}

function isLink(caminho: string) {
  return /^https?:\/\//i.test(caminho)
}

export function DocumentosTable({ documentos, obrasPorId, obra: obraFixa }: DocumentosTableProps) {
  const usuario = useUsuarioLogado()
  const { notify } = useToast()
  const atualizarStatus = useAtualizarStatusDocumento()
  const excluir = useExcluirDocumento()
  const [renomeando, setRenomeando] = useState<Documento | null>(null)
  const [excluindo, setExcluindo] = useState<Documento | null>(null)

  const podeExcluir = can.excluirDocumento(usuario)

  async function avaliar(documento: Documento, status: StatusDocumento) {
    try {
      await atualizarStatus.mutateAsync({ id: documento.id, status })
      notify(status === 'APROVADO' ? 'Documento aprovado.' : 'Documento reprovado.')
    } catch (error) {
      notify(toApiError(error).message, 'error')
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return
    try {
      await excluir.mutateAsync(excluindo.id)
      notify('Documento excluído.')
      setExcluindo(null)
    } catch (error) {
      notify(toApiError(error).message, 'error')
    }
  }

  const ocupado = (id: number) =>
    (atualizarStatus.isPending && atualizarStatus.variables?.id === id) ||
    (excluir.isPending && excluir.variables === id)

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Documento</th>
              {obrasPorId && <th>Obra</th>}
              <th>Status</th>
              <th>Enviado em</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {documentos.map((doc) => {
              const obra = obraFixa ?? obrasPorId?.get(doc.obraId)
              const podeAvaliar = can.avaliarDocumento(usuario, obra)
              return (
                <tr key={doc.id}>
                  <td>
                    <div className="cell-title">
                      <strong>{doc.nome}</strong>
                      <span>
                        {TIPO_DOCUMENTO_LABEL[doc.tipo]}
                        {doc.caminhoArquivo && (
                          <>
                            {' · '}
                            {isLink(doc.caminhoArquivo) ? (
                              <a href={doc.caminhoArquivo} target="_blank" rel="noreferrer noopener">
                                Abrir arquivo <ExternalLink size={12} aria-hidden />
                              </a>
                            ) : (
                              <code>{doc.caminhoArquivo}</code>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  {obrasPorId && (
                    <td>{obra ? <Link to={`/obras/${obra.id}`}>{obra.nome}</Link> : `#${doc.obraId}`}</td>
                  )}
                  <td>
                    <StatusDocumentoBadge status={doc.status} />
                  </td>
                  <td className="nowrap text-muted">{formatarDataHora(doc.dataUpload)}</td>
                  <td>
                    <div className="row-actions">
                      {podeAvaliar && doc.status !== 'APROVADO' && (
                        <button
                          type="button"
                          className="icon-btn icon-btn--success"
                          onClick={() => avaliar(doc, 'APROVADO')}
                          disabled={ocupado(doc.id)}
                          title="Aprovar"
                          aria-label={`Aprovar ${doc.nome}`}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {podeAvaliar && doc.status !== 'REPROVADO' && (
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => avaliar(doc, 'REPROVADO')}
                          disabled={ocupado(doc.id)}
                          title="Reprovar"
                          aria-label={`Reprovar ${doc.nome}`}
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => setRenomeando(doc)}
                        title="Renomear"
                        aria-label={`Renomear ${doc.nome}`}
                      >
                        <Pencil size={16} />
                      </button>
                      {podeExcluir && (
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => setExcluindo(doc)}
                          disabled={ocupado(doc.id)}
                          title="Excluir"
                          aria-label={`Excluir ${doc.nome}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <RenomearDocumentoModal documento={renomeando} onClose={() => setRenomeando(null)} />
      <ConfirmDialog
        open={!!excluindo}
        title="Excluir documento"
        message={`"${excluindo?.nome}" será removido permanentemente.`}
        loading={excluir.isPending}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </>
  )
}
