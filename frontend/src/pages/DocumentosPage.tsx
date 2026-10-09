import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilePlus2, FileText } from 'lucide-react'
import { DocumentoFormModal } from '@/components/documentos/DocumentoFormModal'
import { DocumentosTable } from '@/components/documentos/DocumentosTable'
import { Button, EmptyState, ErrorState, PageHeader, PageLoader, SearchInput } from '@/components/ui'
import { useDocumentos, useObras } from '@/hooks/queries'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { STATUS_DOCUMENTO, STATUS_DOCUMENTO_LABEL, TIPO_DOCUMENTO_LABEL } from '@/lib/constants'
import type { Obra, StatusDocumento } from '@/types/api'

export function DocumentosPage() {
  useDocumentTitle('Documentos')
  const documentos = useDocumentos()
  const obras = useObras()
  const [params, setParams] = useSearchParams()
  const [busca, setBusca] = useState('')
  const [novo, setNovo] = useState(false)

  const statusParam = params.get('status') as StatusDocumento | null
  const filtro = statusParam && STATUS_DOCUMENTO.includes(statusParam) ? statusParam : 'TODOS'

  const obrasPorId = useMemo(() => new Map<number, Obra>((obras.data ?? []).map((o) => [o.id, o])), [obras.data])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return (documentos.data ?? [])
      // Mantém só documentos de obras que o usuário enxerga.
      .filter((d) => obrasPorId.has(d.obraId))
      .filter((d) => filtro === 'TODOS' || d.status === filtro)
      .filter(
        (d) =>
          !termo ||
          d.nome.toLowerCase().includes(termo) ||
          TIPO_DOCUMENTO_LABEL[d.tipo].toLowerCase().includes(termo) ||
          obrasPorId.get(d.obraId)!.nome.toLowerCase().includes(termo),
      )
      .sort((a, b) => b.dataUpload.localeCompare(a.dataUpload))
  }, [documentos.data, obrasPorId, filtro, busca])

  function trocarFiltro(status: StatusDocumento | 'TODOS') {
    setParams(status === 'TODOS' ? {} : { status }, { replace: true })
  }

  const carregando = documentos.isPending || obras.isPending
  const erro = documentos.isError || obras.isError

  return (
    <>
      <PageHeader
        title="Documentos"
        description="Todos os documentos das obras, com fluxo de aprovação."
        actions={
          <Button icon={<FilePlus2 size={16} />} onClick={() => setNovo(true)}>
            Novo documento
          </Button>
        }
      />

      <div className="toolbar">
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por nome, tipo ou obra" />
        <div className="segmented" role="group" aria-label="Filtrar por status">
          {(['TODOS', ...STATUS_DOCUMENTO] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={filtro === s ? 'is-active' : ''}
              onClick={() => trocarFiltro(s)}
              aria-pressed={filtro === s}
            >
              {s === 'TODOS' ? 'Todos' : STATUS_DOCUMENTO_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <section className="card card--flush">
        {carregando ? (
          <PageLoader />
        ) : erro ? (
          <ErrorState
            message="Não foi possível carregar os documentos."
            onRetry={() => {
              documentos.refetch()
              obras.refetch()
            }}
          />
        ) : filtrados.length === 0 ? (
          <EmptyState icon={<FileText />} title="Nenhum documento encontrado" />
        ) : (
          <DocumentosTable documentos={filtrados} obrasPorId={obrasPorId} />
        )}
      </section>

      <DocumentoFormModal open={novo} onClose={() => setNovo(false)} />
    </>
  )
}
