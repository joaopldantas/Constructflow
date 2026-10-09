import { request, type APIRequestContext } from '@playwright/test'

export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080'
export const SENHA_PADRAO = 'senha123'

export const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? 'admin@constructflow.dev',
  senha: process.env.E2E_ADMIN_SENHA ?? 'senha123',
}

export type Papel = 'ADMIN' | 'ENGENHEIRO' | 'BACKOFFICE' | 'CAMPO'
export type StatusObra = 'PLANEJADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA'
export type StatusDocumento = 'PENDENTE' | 'APROVADO' | 'REPROVADO'

export interface Credenciais {
  email: string
  senha: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  papel: Papel
  senha: string
}

export interface Obra {
  id: number
  nome: string
  status: StatusObra
  responsavelId: number
}

export interface Documento {
  id: number
  nome: string
  status: StatusDocumento
  obraId: number
}

/** Sufixo único para que os testes não dependam do estado do banco nem colidam entre si. */
export function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export async function obterToken(credenciais: Credenciais): Promise<string> {
  const ctx = await request.newContext({ baseURL: API_URL })
  const response = await ctx.post('/auth/login', { data: credenciais })
  if (!response.ok()) {
    throw new Error(`Login falhou para ${credenciais.email}: ${response.status()} ${await response.text()}`)
  }
  const token = await response.text()
  await ctx.dispose()
  return token
}

/** Cliente da API autenticado como ADMIN, usado para preparar dados dos testes. */
export class ApiClient {
  private constructor(private readonly ctx: APIRequestContext) {}

  static async comoAdmin(): Promise<ApiClient> {
    const token = await obterToken(ADMIN)
    const ctx = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    })
    return new ApiClient(ctx)
  }

  async dispose() {
    await this.ctx.dispose()
  }

  private async post<T>(path: string, data: unknown): Promise<T> {
    const response = await this.ctx.post(path, { data })
    if (!response.ok()) {
      throw new Error(`POST ${path} falhou: ${response.status()} ${await response.text()}`)
    }
    return (await response.json()) as T
  }

  async criarUsuario(papel: Papel, nome = `Usuário ${uid()}`): Promise<Usuario> {
    const email = `e2e.${papel.toLowerCase()}.${uid()}@constructflow.dev`
    const criado = await this.post<Omit<Usuario, 'senha'>>('/usuarios', {
      nome,
      email,
      senha: SENHA_PADRAO,
      papel,
    })
    return { ...criado, senha: SENHA_PADRAO }
  }

  async criarObra(dados: { responsavelId: number; nome?: string; status?: StatusObra }): Promise<Obra> {
    return this.post<Obra>('/obras', {
      nome: dados.nome ?? `Obra ${uid()}`,
      endereco: 'Rua dos Testes, 100 - São Paulo/SP',
      cep: '01001-000',
      status: dados.status ?? 'PLANEJADA',
      responsavelId: dados.responsavelId,
    })
  }

  async criarDocumento(dados: { obraId: number; nome?: string; status?: StatusDocumento }): Promise<Documento> {
    return this.post<Documento>('/documentos', {
      obraId: dados.obraId,
      nome: dados.nome ?? `Documento ${uid()}`,
      tipo: 'PROJETO',
      status: dados.status ?? 'PENDENTE',
    })
  }
}
