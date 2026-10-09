// Espelha os DTOs e enums da ConstructFlow API (constructflow-api/.../dto e entities/enums).

export type Papel = 'ADMIN' | 'ENGENHEIRO' | 'BACKOFFICE' | 'CAMPO'
export type StatusObra = 'PLANEJADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA'
export type StatusDocumento = 'PENDENTE' | 'APROVADO' | 'REPROVADO'
export type TipoDocumento =
  | 'ORCAMENTO'
  | 'CONTRATO'
  | 'NOTA_FISCAL'
  | 'PROJETO'
  | 'RELATORIO'
  | 'OUTRO'

export interface Usuario {
  id: number
  nome: string
  email: string
  papel: Papel
}

export interface CriarUsuarioRequest {
  nome: string
  email: string
  senha: string
  papel: Papel
}

export type AtualizarUsuarioRequest = Partial<CriarUsuarioRequest>

export interface Obra {
  id: number
  nome: string
  endereco: string
  cep: string | null
  status: StatusObra
  responsavelId: number | null
}

export interface CriarObraRequest {
  nome: string
  endereco: string
  cep: string
  status: StatusObra
  responsavelId: number
}

export type AtualizarObraRequest = Partial<Omit<CriarObraRequest, 'status'>>

export interface Documento {
  id: number
  nome: string
  caminhoArquivo: string | null
  tipo: TipoDocumento
  status: StatusDocumento
  dataUpload: string
  obraId: number
}

export interface CriarDocumentoRequest {
  nome: string
  tipo: TipoDocumento
  status: StatusDocumento
  caminhoArquivo?: string
  obraId: number
}

export interface ApiErrorBody {
  status: number
  error: string
  message: string
  path: string
  timestamp: string
  validationErrors: Record<string, string> | null
}
