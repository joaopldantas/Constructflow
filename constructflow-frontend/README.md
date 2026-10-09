# ConstructFlow — Frontend

Painel web do ConstructFlow, feito com React 19, TypeScript e Vite.

## Scripts

| Comando             | Descrição |
|---------------------|-----------|
| `npm run dev`       | Servidor de desenvolvimento em `http://localhost:5173` |
| `npm run build`     | Checagem de tipos + build de produção em `dist/` |
| `npm run preview`   | Serve o build localmente |
| `npm run lint`      | ESLint |
| `npm run typecheck` | Só a checagem de tipos |

## Configuração

```bash
cp .env.example .env
```

| Variável       | Padrão                  | Descrição |
|----------------|-------------------------|-----------|
| `VITE_API_URL` | `http://localhost:8080` | URL base da ConstructFlow API |

A API só aceita requisições (CORS) de `http://localhost:5173` e `http://localhost:5174`.

## Arquitetura

```text
src/
├── components/
│   ├── ui/            # Design system: Button, Modal, Field, Badge, EmptyState…
│   ├── layout/        # AppLayout (sidebar), Logo, guards de rota
│   ├── obras/         # Componentes do domínio de obras
│   ├── documentos/    # Tabela e modais de documentos
│   └── usuarios/      # Modal de usuário
├── contexts/          # AuthProvider (JWT + usuário logado) e ToastProvider
├── hooks/             # queries.ts (React Query), useAuth, useToast, useFormState
├── lib/               # api (axios + tratamento de erro), token, permissões, formatação
├── pages/             # Uma tela por rota
├── services/          # Chamadas HTTP agrupadas por recurso
├── styles/            # Tokens de design e estilos globais (claro/escuro)
└── types/             # Tipos que espelham os DTOs da API
```

### Decisões

- **Estado do servidor no TanStack Query**: cache, revalidação depois de cada mutação e estados de loading/erro sem precisar de store global.
- **Sessão**: o JWT fica no `localStorage`. Depois do login, o usuário é carregado por `GET /usuarios/email`. A sessão termina sozinha quando o token expira ou quando a API responde `401`.
- **Permissões na UI** (`lib/permissions.ts`): espelham as regras dos services da API e servem só para esconder ações. Quem autoriza de fato é o backend.
- **Erros da API**: `toApiError` transforma as respostas no formato `ErrorResponseDTO` em mensagens amigáveis e encaixa os `validationErrors` nos campos do formulário.
- **Sem framework de CSS**: tokens em CSS custom properties, com tema escuro via `prefers-color-scheme`.

## Rotas

| Rota            | Tela | Acesso |
|-----------------|------|--------|
| `/login`        | Login | Público |
| `/`             | Visão geral (indicadores) | Autenticado |
| `/obras`        | Lista de obras com busca e filtro | Autenticado |
| `/obras/:id`    | Detalhe, transição de status e documentos | Autenticado |
| `/documentos`   | Todos os documentos, com aprovação | Autenticado |
| `/usuarios`     | Gestão de usuários | `ADMIN` |
