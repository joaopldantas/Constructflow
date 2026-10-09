import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada')
  return (
    <EmptyState
      icon={<Compass />}
      title="Página não encontrada"
      description="O endereço acessado não existe."
      action={
        <Link to="/" className="link-btn">
          Ir para a visão geral
        </Link>
      }
    />
  )
}
