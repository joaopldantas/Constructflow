import { api } from '@/lib/api'
import type { AtualizarUsuarioRequest, CriarUsuarioRequest, Usuario } from '@/types/api'

export const usuariosService = {
  listar: () => api.get<Usuario[]>('/usuarios').then((r) => r.data),
  buscarPorId: (id: number) => api.get<Usuario>(`/usuarios/${id}`).then((r) => r.data),
  buscarPorEmail: (email: string) =>
    api.get<Usuario>('/usuarios/email', { params: { email } }).then((r) => r.data),
  criar: (dados: CriarUsuarioRequest) => api.post<Usuario>('/usuarios', dados).then((r) => r.data),
  atualizar: (id: number, dados: AtualizarUsuarioRequest) =>
    api.patch<Usuario>(`/usuarios/${id}`, dados).then((r) => r.data),
  excluir: (id: number) => api.delete<void>(`/usuarios/${id}`),
}
