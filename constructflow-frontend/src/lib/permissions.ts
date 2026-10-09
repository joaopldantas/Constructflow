import type { Obra, Usuario } from '@/types/api'

// Regras espelhadas dos services da API, usadas apenas para esconder ações na UI.
// A autorização real continua sendo responsabilidade do backend.
export const can = {
  gerenciarUsuarios: (u: Usuario) => u.papel === 'ADMIN',
  criarObra: (u: Usuario) => u.papel === 'ADMIN' || u.papel === 'BACKOFFICE',
  editarObra: (u: Usuario) => u.papel === 'ADMIN' || u.papel === 'BACKOFFICE',
  excluirObra: (u: Usuario) => u.papel === 'ADMIN',
  alterarStatusObra: (u: Usuario, obra: Obra) =>
    u.papel === 'ADMIN' || (u.papel === 'ENGENHEIRO' && obra.responsavelId === u.id),
  avaliarDocumento: (u: Usuario) =>
    u.papel === 'ADMIN' || u.papel === 'ENGENHEIRO' || u.papel === 'BACKOFFICE',
  excluirDocumento: (u: Usuario) => u.papel === 'ADMIN' || u.papel === 'BACKOFFICE',
}
