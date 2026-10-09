import { iniciais } from '@/lib/format'

export function Avatar({ nome, size = 32 }: { nome: string; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden>
      {iniciais(nome)}
    </span>
  )
}
