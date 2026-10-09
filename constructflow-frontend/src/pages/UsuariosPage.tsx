import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { UsuarioFormModal } from '@/components/usuarios/UsuarioFormModal'
import {
  Avatar,
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@/components/ui'
import { useExcluirUsuario, useObras, useUsuarios } from '@/hooks/queries'
import { useUsuarioLogado } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useToast } from '@/hooks/useToast'
import { toApiError } from '@/lib/api'
import { PAPEL_LABEL } from '@/lib/constants'
import type { Usuario } from '@/types/api'

export function UsuariosPage() {
  useDocumentTitle('Usuários')
  const logado = useUsuarioLogado()
  const { notify } = useToast()
  const { data: usuarios, isPending, isError, refetch } = useUsuarios()
  const { data: obras = [] } = useObras()
  const excluir = useExcluirUsuario()
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState<{ usuario: Usuario | null } | null>(null)
  const [excluindo, setExcluindo] = useState<Usuario | null>(null)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return (usuarios ?? [])
      .filter((u) => !termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [usuarios, busca])

  const obrasResponsavel = (id: number) => obras.filter((o) => o.responsavelId === id).length

  async function confirmarExclusao() {
    if (!excluindo) return
    try {
      await excluir.mutateAsync(excluindo.id)
      notify('Usuário excluído.')
      setExcluindo(null)
    } catch (error) {
      notify(toApiError(error, 'Não foi possível excluir o usuário.').message, 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Gerencie quem acessa o sistema e o papel de cada pessoa."
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setModal({ usuario: null })}>
            Novo usuário
          </Button>
        }
      />

      <div className="toolbar">
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por nome ou email" />
      </div>

      <section className="card card--flush">
        {isPending ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState message="Não foi possível carregar os usuários." onRetry={refetch} />
        ) : filtrados.length === 0 ? (
          <EmptyState icon={<Users />} title="Nenhum usuário encontrado" />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Papel</th>
                  <th>Obras como responsável</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u) => {
                  const qtdObras = obrasResponsavel(u.id)
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <Avatar nome={u.nome} />
                          <div className="cell-title">
                            <strong>
                              {u.nome} {u.id === logado.id && <span className="text-muted">(você)</span>}
                            </strong>
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge tone={u.papel === 'ADMIN' ? 'info' : 'neutral'}>{PAPEL_LABEL[u.papel]}</Badge>
                      </td>
                      <td className="text-muted">{u.papel === 'ENGENHEIRO' ? qtdObras : '—'}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => setModal({ usuario: u })}
                            title="Editar"
                            aria-label={`Editar ${u.nome}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            onClick={() => setExcluindo(u)}
                            disabled={u.id === logado.id || qtdObras > 0}
                            title={
                              u.id === logado.id
                                ? 'Você não pode excluir a si mesmo'
                                : qtdObras > 0
                                  ? 'Responsável por obras — transfira antes de excluir'
                                  : 'Excluir'
                            }
                            aria-label={`Excluir ${u.nome}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <UsuarioFormModal open={!!modal} usuario={modal?.usuario} onClose={() => setModal(null)} />
      <ConfirmDialog
        open={!!excluindo}
        title="Excluir usuário"
        message={`${excluindo?.nome} perderá o acesso ao sistema.`}
        loading={excluir.isPending}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </>
  )
}
