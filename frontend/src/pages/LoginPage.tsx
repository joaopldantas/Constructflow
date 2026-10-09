import { useState } from 'react'
import { Building2, FileCheck2, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Button, FormAlert, InputField } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toApiError } from '@/lib/api'

export function LoginPage() {
  useDocumentTitle('Entrar')
  const { entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim() || !senha) {
      setErro('Informe email e senha.')
      return
    }
    setErro(null)
    setEnviando(true)
    try {
      // O redirecionamento acontece em PublicOnlyRoute assim que o usuário é carregado.
      await entrar({ email: email.trim(), senha })
    } catch (error) {
      setErro(toApiError(error, 'Email ou senha inválidos.').message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero" aria-hidden>
        <Logo />
        <div>
          <h2>Gestão de obras e documentação técnica em um só lugar.</h2>
          <ul>
            <li>
              <Building2 size={18} /> Acompanhe o ciclo de vida de cada obra
            </li>
            <li>
              <FileCheck2 size={18} /> Centralize e aprove documentos
            </li>
            <li>
              <ShieldCheck size={18} /> Acesso controlado por papel
            </li>
          </ul>
        </div>
        <small>© {new Date().getFullYear()} ConstructFlow</small>
      </section>

      <section className="auth-panel">
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="auth-form__mobile-logo">
            <Logo />
          </div>
          <h1>Entrar</h1>
          <p className="text-muted">Use suas credenciais corporativas para acessar.</p>
          <FormAlert message={erro} />
          <InputField
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
           
          />
          <InputField
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button type="submit" loading={enviando} className="btn--block">
            Entrar
          </Button>
        </form>
      </section>
    </div>
  )
}
