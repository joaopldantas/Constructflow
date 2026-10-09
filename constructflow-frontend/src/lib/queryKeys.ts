export const queryKeys = {
  me: (email: string) => ['me', email] as const,
  usuarios: ['usuarios'] as const,
  obras: ['obras'] as const,
  obra: (id: number) => ['obras', id] as const,
  documentos: ['documentos'] as const,
  documentosDaObra: (obraId: number) => ['documentos', 'obra', obraId] as const,
}
