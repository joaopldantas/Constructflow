import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Building2, FileText, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { useAuth, useUsuarioLogado } from '@/hooks/useAuth'
import { PAPEL_LABEL } from '@/lib/constants'
import { can } from '@/lib/permissions'
import { Logo } from './Logo'

export function AppLayout() {
  const usuario = useUsuarioLogado()
  const { sair } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const links = [
    { to: '/', label: 'Visão geral', icon: LayoutDashboard, end: true },
    { to: '/obras', label: 'Obras', icon: Building2 },
    { to: '/documentos', label: 'Documentos', icon: FileText },
    ...(can.gerenciarUsuarios(usuario) ? [{ to: '/usuarios', label: 'Usuários', icon: Users }] : []),
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuAberto ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <Logo />
          <button
            type="button"
            className="icon-btn sidebar__close"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Navegação principal">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="sidebar__link" onClick={() => setMenuAberto(false)}>
              <Icon size={18} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="user-chip">
            <Avatar nome={usuario.nome} />
            <div>
              <strong>{usuario.nome}</strong>
              <span>{PAPEL_LABEL[usuario.papel]}</span>
            </div>
          </div>
          <button type="button" className="sidebar__link" onClick={sair}>
            <LogOut size={18} aria-hidden />
            Sair
          </button>
        </div>
      </aside>

      {menuAberto && <div className="sidebar-backdrop" onClick={() => setMenuAberto(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <Logo />
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
