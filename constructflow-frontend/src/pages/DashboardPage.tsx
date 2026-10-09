import { Link } from 'react-router-dom'
import { ArrowRight, Building2, CheckCircle2, Clock, FileText, HardHat } from 'lucide-react'
import { EmptyState, ErrorState, PageHeader, PageLoader, StatusObraBadge } from '@/components/ui'
import { useDocumentos, useObras, useUsuariosPorId } from '@/hooks/queries'
import { useUsuarioLogado } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { STATUS_OBRA, STATUS_OBRA_LABEL } from '@/lib/constants'

export function DashboardPage() {
  useDocumentTitle('Visão geral')
  const usuario = useUsuarioLogado()
  const obras = useObras()
  const documentos = useDocumentos()
  const usuariosPorId = useUsuariosPorId()

  if (obras.isPending || documentos.isPending) return <PageLoader />
  if (obras.isError || documentos.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar os dados."
        onRetry={() => {
          obras.refetch()
          documentos.refetch()
        }}
      />
    )
  }

  const listaObras = obras.data
  // Para papéis com visão restrita, considera apenas documentos das obras visíveis.
  const idsVisiveis = new Set(listaObras.map((o) => o.id))
  const listaDocs = documentos.data.filter((d) => idsVisiveis.has(d.obraId))
  const pendentes = listaDocs.filter((d) => d.status === 'PENDENTE')
  const contagem = (status: string) => listaObras.filter((o) => o.status === status).length
  const recentes = [...listaObras].sort((a, b) => b.id - a.id).slice(0, 5)

  const stats = [
    { label: 'Obras', value: listaObras.length, icon: Building2 },
    { label: 'Em andamento', value: contagem('EM_ANDAMENTO'), icon: HardHat },
    { label: 'Finalizadas', value: contagem('FINALIZADA'), icon: CheckCircle2 },
    { label: 'Docs. pendentes', value: pendentes.length, icon: Clock },
  ]

  return (
    <>
      <PageHeader
        title={`Olá, ${usuario.nome.split(' ')[0]}`}
        description="Resumo das obras e documentos sob sua visão."
      />

      <section className="stat-grid" aria-label="Indicadores">
        {stats.map(({ label, value, icon: Icon }) => (
          <article key={label} className="stat-card">
            <div className="stat-card__icon">
              <Icon size={20} aria-hidden />
            </div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="card">
          <header className="card__header">
            <h2>Obras recentes</h2>
            <Link to="/obras" className="link-btn">
              Ver todas <ArrowRight size={14} />
            </Link>
          </header>
          {recentes.length === 0 ? (
            <EmptyState icon={<Building2 />} title="Nenhuma obra ainda" />
          ) : (
            <ul className="list">
              {recentes.map((obra) => (
                <li key={obra.id}>
                  <Link to={`/obras/${obra.id}`} className="list__item">
                    <div className="cell-title">
                      <strong>{obra.nome}</strong>
                      <span>
                        {obra.responsavelId ? usuariosPorId.get(obra.responsavelId)?.nome ?? '—' : '—'}
                      </span>
                    </div>
                    <StatusObraBadge status={obra.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <header className="card__header">
            <h2>Obras por status</h2>
          </header>
          <ul className="status-bars">
            {STATUS_OBRA.map((status) => {
              const total = contagem(status)
              const pct = listaObras.length ? (total / listaObras.length) * 100 : 0
              return (
                <li key={status}>
                  <div className="status-bars__label">
                    <span>{STATUS_OBRA_LABEL[status]}</span>
                    <strong>{total}</strong>
                  </div>
                  <div className="status-bars__track">
                    <div className={`status-bars__fill status-bars__fill--${status.toLowerCase()}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>

          <header className="card__header card__header--spaced">
            <h2>Aguardando avaliação</h2>
            <Link to="/documentos?status=PENDENTE" className="link-btn">
              Revisar <ArrowRight size={14} />
            </Link>
          </header>
          <p className="text-muted">
            <FileText size={14} aria-hidden /> {pendentes.length}{' '}
            {pendentes.length === 1 ? 'documento pendente' : 'documentos pendentes'}
          </p>
        </section>
      </div>
    </>
  )
}
