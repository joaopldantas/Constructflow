import { api } from '@/lib/api'
import type { CriarDocumentoRequest, Documento, StatusDocumento } from '@/types/api'

export const documentosService = {
  listar: () => api.get<Documento[]>('/documentos').then((r) => r.data),
  listarPorObra: (obraId: number) =>
    api.get<Documento[]>(`/documentos/obras/${obraId}`).then((r) => r.data),
  criar: (dados: CriarDocumentoRequest) =>
    api.post<Documento>('/documentos', dados).then((r) => r.data),
  atualizarStatus: (id: number, status: StatusDocumento) =>
    api.put<Documento>(`/documentos/${id}/status`, { status }).then((r) => r.data),
  renomear: (id: number, nome: string) =>
    api.put<Documento>(`/documentos/${id}/nome`, { nome }).then((r) => r.data),
  excluir: (id: number) => api.delete<void>(`/documentos/${id}`),
}
