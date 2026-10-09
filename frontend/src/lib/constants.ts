import type { Papel, StatusDocumento, StatusObra, TipoDocumento } from '@/types/api'

export const PAPEL_LABEL: Record<Papel, string> = {
  ADMIN: 'Administrador',
  ENGENHEIRO: 'Engenheiro',
  BACKOFFICE: 'Backoffice',
  CAMPO: 'Campo',
}

export const STATUS_OBRA_LABEL: Record<StatusObra, string> = {
  PLANEJADA: 'Planejada',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
}

export const STATUS_DOCUMENTO_LABEL: Record<StatusDocumento, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
}

export const TIPO_DOCUMENTO_LABEL: Record<TipoDocumento, string> = {
  ORCAMENTO: 'Orçamento',
  CONTRATO: 'Contrato',
  NOTA_FISCAL: 'Nota fiscal',
  PROJETO: 'Projeto',
  RELATORIO: 'Relatório',
  OUTRO: 'Outro',
}

export const PAPEIS = Object.keys(PAPEL_LABEL) as Papel[]
export const STATUS_OBRA = Object.keys(STATUS_OBRA_LABEL) as StatusObra[]
export const STATUS_DOCUMENTO = Object.keys(STATUS_DOCUMENTO_LABEL) as StatusDocumento[]
export const TIPOS_DOCUMENTO = Object.keys(TIPO_DOCUMENTO_LABEL) as TipoDocumento[]

/** Mesma máquina de estados de StatusObra.podeIrPara na API. */
export function proximosStatusObra(atual: StatusObra): StatusObra[] {
  switch (atual) {
    case 'PLANEJADA':
      return ['EM_ANDAMENTO']
    case 'EM_ANDAMENTO':
      return ['FINALIZADA', 'CANCELADA']
    default:
      return []
  }
}
