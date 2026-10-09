import { api } from '@/lib/api'
import type { AtualizarObraRequest, CriarObraRequest, Obra, StatusObra } from '@/types/api'

export const obrasService = {
  listar: () => api.get<Obra[]>('/obras').then((r) => r.data),
  buscarPorId: (id: number) => api.get<Obra>(`/obras/${id}`).then((r) => r.data),
  criar: (dados: CriarObraRequest) => api.post<Obra>('/obras', dados).then((r) => r.data),
  atualizar: (id: number, dados: AtualizarObraRequest) =>
    api.patch<Obra>(`/obras/${id}`, dados).then((r) => r.data),
  atualizarStatus: (id: number, status: StatusObra) =>
    api.patch<Obra>(`/obras/${id}/status`, { status }).then((r) => r.data),
  excluir: (id: number) => api.delete<void>(`/obras/${id}`),
}
