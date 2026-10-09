import { STATUS_DOCUMENTO_LABEL, STATUS_OBRA_LABEL } from '@/lib/constants'
import type { StatusDocumento, StatusObra } from '@/types/api'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: string }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

const OBRA_TONE: Record<StatusObra, Tone> = {
  PLANEJADA: 'neutral',
  EM_ANDAMENTO: 'info',
  FINALIZADA: 'success',
  CANCELADA: 'danger',
}

const DOCUMENTO_TONE: Record<StatusDocumento, Tone> = {
  PENDENTE: 'warning',
  APROVADO: 'success',
  REPROVADO: 'danger',
}

export function StatusObraBadge({ status }: { status: StatusObra }) {
  return <Badge tone={OBRA_TONE[status]}>{STATUS_OBRA_LABEL[status]}</Badge>
}

export function StatusDocumentoBadge({ status }: { status: StatusDocumento }) {
  return <Badge tone={DOCUMENTO_TONE[status]}>{STATUS_DOCUMENTO_LABEL[status]}</Badge>
}
