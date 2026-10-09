import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin, Plus } from 'lucide-react'
import { ObraFormModal } from '@/components/obras/ObraFormModal'
import {
  Button,
  EmptyState,
  ErrorState,
  PageHeader,
  PageLoader,
  SearchInput,
  StatusObraBadge,
} from '@/components/ui'
import { useObras, useUsuariosPorId } from '@/hooks/queries'
import { useUsuarioLogado } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { STATUS_OBRA, STATUS_OBRA_LABEL } from '@/lib/constants'
import { can } from '@/lib/permissions'
import type { StatusObra } from '@/types/api'

export function ObrasPage() {
  useDocumentTitle('Obras')
  const usuario = useUsuarioLogado()
  const { data: obras, isPending, isError, refetch } = useObras()
  const usuariosPorId = useUsuariosPorId()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<StatusObra | 'TODAS'>('TODAS')
  const [criando, setCriando] = useState(false)

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return (obras ?? [])
      .filter((o) => filtro === 'TODAS' || o.status === filtro)
      .filter(
        (o) =>
          !termo ||
          o.nome.toLowerCase().includes(termo) ||
          o.endereco.toLowerCase().includes(termo) ||
          (o.cep ?? '').includes(termo),
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [obras, busca, filtro])

  const podeCriar = can.criarObra(usuario)

  return (
    <>
      <PageHeader
        title="Obras"
        description="Cadastre obras, acompanhe o status e acesse a documentação de cada uma."
        actions={
          podeCriar && (
            <Button icon={<Plus size={16} />} onClick={() => setCriando(true)}>
              Nova obra
            </Button>
          )
        }
      />

      <div className="toolbar">
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por nome, endereço ou CEP" />
        <div className="segmented" role="group" aria-label="Filtrar por status">
          {(['TODAS', ...STATUS_OBRA] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={filtro === s ? 'is-active' : ''}
              onClick={() => setFiltro(s)}
              aria-pressed={filtro === s}
            >
              {s === 'TODAS' ? 'Todas' : STATUS_OBRA_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <PageLoader />
      ) : isError ? (
        <ErrorState message="Não foi possível carregar as obras." onRetry={refetch} />
      ) : filtradas.length === 0 ? (
        <EmptyState
          icon={<Building2 />}
          title={obras.length ? 'Nenhuma obra encontrada' : 'Nenhuma obra cadastrada'}
          description={obras.length ? 'Ajuste a busca ou o filtro.' : 'Comece cadastrando a primeira obra.'}
          action={
            !obras.length &&
            podeCriar && (
              <Button icon={<Plus size={16} />} onClick={() => setCriando(true)}>
                Nova obra
              </Button>
            )
          }
        />
      ) : (
        <div className="obra-grid">
          {filtradas.map((obra) => {
            const responsavel = obra.responsavelId ? usuariosPorId.get(obra.responsavelId) : undefined
            return (
              <Link key={obra.id} to={`/obras/${obra.id}`} className="obra-card">
                <div className="obra-card__top">
                  <StatusObraBadge status={obra.status} />
                  <span className="text-muted">#{obra.id}</span>
                </div>
                <h3>{obra.nome}</h3>
                <p className="obra-card__address">
                  <MapPin size={14} aria-hidden />
                  {obra.endereco}
                  {obra.cep && ` · ${obra.cep}`}
                </p>
                <footer>
                  <span className="text-muted">Responsável</span>
                  <strong>{responsavel?.nome ?? '—'}</strong>
                </footer>
              </Link>
            )
          })}
        </div>
      )}

      <ObraFormModal open={criando} onClose={() => setCriando(false)} />
    </>
  )
}
