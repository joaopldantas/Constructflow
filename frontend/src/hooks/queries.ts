import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { documentosService } from '@/services/documentos.service'
import { obrasService } from '@/services/obras.service'
import { usuariosService } from '@/services/usuarios.service'
import type {
  AtualizarObraRequest,
  AtualizarUsuarioRequest,
  CriarDocumentoRequest,
  CriarObraRequest,
  CriarUsuarioRequest,
  StatusDocumento,
  StatusObra,
  Usuario,
} from '@/types/api'

// ---------- Queries ----------

export const useObras = () => useQuery({ queryKey: queryKeys.obras, queryFn: obrasService.listar })

export const useObra = (id: number) =>
  useQuery({ queryKey: queryKeys.obra(id), queryFn: () => obrasService.buscarPorId(id) })

export const useUsuarios = () =>
  useQuery({ queryKey: queryKeys.usuarios, queryFn: usuariosService.listar })

export const useDocumentos = () =>
  useQuery({ queryKey: queryKeys.documentos, queryFn: documentosService.listar })

export const useDocumentosDaObra = (obraId: number) =>
  useQuery({
    queryKey: queryKeys.documentosDaObra(obraId),
    queryFn: () => documentosService.listarPorObra(obraId),
  })

/** Mapa id → usuário, para exibir nomes a partir dos ids que a API retorna. */
export function useUsuariosPorId() {
  const { data } = useUsuarios()
  return useMemo(() => new Map<number, Usuario>((data ?? []).map((u) => [u.id, u])), [data])
}

// ---------- Mutations ----------

function useInvalidate() {
  const queryClient = useQueryClient()
  return (...keys: readonly (readonly unknown[])[]) =>
    Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
}

export function useCriarObra() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (dados: CriarObraRequest) => obrasService.criar(dados),
    onSuccess: () => invalidate(queryKeys.obras),
  })
}

export function useAtualizarObra() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: AtualizarObraRequest }) =>
      obrasService.atualizar(id, dados),
    onSuccess: () => invalidate(queryKeys.obras),
  })
}

export function useAtualizarStatusObra() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusObra }) =>
      obrasService.atualizarStatus(id, status),
    onSuccess: () => invalidate(queryKeys.obras),
  })
}

export function useExcluirObra() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => obrasService.excluir(id),
    onSuccess: () => invalidate(queryKeys.obras, queryKeys.documentos),
  })
}

export function useCriarDocumento() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (dados: CriarDocumentoRequest) => documentosService.criar(dados),
    onSuccess: () => invalidate(queryKeys.documentos),
  })
}

export function useAtualizarStatusDocumento() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusDocumento }) =>
      documentosService.atualizarStatus(id, status),
    onSuccess: () => invalidate(queryKeys.documentos),
  })
}

export function useRenomearDocumento() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, nome }: { id: number; nome: string }) => documentosService.renomear(id, nome),
    onSuccess: () => invalidate(queryKeys.documentos),
  })
}

export function useExcluirDocumento() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => documentosService.excluir(id),
    onSuccess: () => invalidate(queryKeys.documentos),
  })
}

export function useCriarUsuario() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (dados: CriarUsuarioRequest) => usuariosService.criar(dados),
    onSuccess: () => invalidate(queryKeys.usuarios),
  })
}

export function useAtualizarUsuario() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: AtualizarUsuarioRequest }) =>
      usuariosService.atualizar(id, dados),
    onSuccess: () => invalidate(queryKeys.usuarios),
  })
}

export function useExcluirUsuario() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => usuariosService.excluir(id),
    onSuccess: () => invalidate(queryKeys.usuarios),
  })
}
