<div align="center">

# ConstructFlow

**Plataforma de gestão de obras e documentação técnica para construtoras.**

Cadastro de obras, controle de ciclo de vida, fluxo de aprovação de documentos e acesso por papel — em uma API REST com Spring Boot e um painel web em React.

![Java](https://img.shields.io/badge/Java-23-007396?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

</div>

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Configuração](#configuração)
- [Papéis e permissões](#papéis-e-permissões)
- [Referência da API](#referência-da-api)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Roadmap](#roadmap)

## Funcionalidades

- **Autenticação JWT** com senha criptografada (BCrypt) e sessão stateless.
- **Obras** — cadastro com endereço/CEP e engenheiro responsável, com máquina de estados de status:

  ```text
  PLANEJADA ──► EM_ANDAMENTO ──┬──► FINALIZADA
                               └──► CANCELADA
  ```

- **Documentos** — orçamentos, contratos, notas fiscais, projetos e relatórios vinculados a uma obra, com fluxo `PENDENTE → APROVADO | REPROVADO`.
- **Usuários e papéis** — `ADMIN`, `ENGENHEIRO`, `BACKOFFICE` e `CAMPO`, cada um com uma visão diferente das obras.
- **Painel web** — visão geral com indicadores, busca e filtros, layout responsivo e tema claro/escuro automático.
- **Erros padronizados** — respostas de erro com o mesmo formato em toda a API, incluindo erros de validação por campo.

## Arquitetura

```text
┌──────────────────────┐   HTTP/JSON + JWT   ┌─────────────────────────┐   JPA   ┌──────────────┐
│  constructflow-      │ ──────────────────► │  constructflow-api      │ ──────► │  PostgreSQL  │
│  frontend (React)    │ ◄────────────────── │  (Spring Boot)          │         │              │
└──────────────────────┘                     └─────────────────────────┘         └──────────────┘
        :5173                                         :8080                            :5432
```

A API segue camadas clássicas: `controllers` → `services` (regras de negócio e autorização) → `repositories` (Spring Data JPA) → `entities`. Os dados trafegam como DTOs (Java `record`), e o tratamento de exceções fica centralizado em um `@RestControllerAdvice`.

## Stack

| Camada    | Tecnologias |
|-----------|-------------|
| Backend   | Java 23, Spring Boot 3.4 (Web, Data JPA, Validation, Security), JJWT, Lombok, Maven |
| Banco     | PostgreSQL 17 (via Docker Compose) |
| Frontend  | React 19, TypeScript, Vite 7, React Router 7, TanStack Query 5, Axios, Lucide |
| Qualidade | ESLint + typescript-eslint, TypeScript `strict` |

## Como rodar

### Pré-requisitos

- Java 23+
- Node.js 20+
- Docker (ou um PostgreSQL 14+ local)

### 1. Banco de dados

```bash
docker compose up -d
```

Isso sobe um PostgreSQL com o banco `constructflow` já criado. As tabelas são geradas automaticamente pelo Hibernate na primeira execução da API.

> Sem Docker? Crie o banco manualmente: `createdb constructflow`.

### 2. API

```bash
cd constructflow-api
ADMIN_EMAIL=admin@constructflow.dev ADMIN_SENHA=senha123 ./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`. Na primeira execução, ela cria o administrador inicial com as credenciais de `ADMIN_EMAIL`/`ADMIN_SENHA`. O cadastro de usuários exige um ADMIN autenticado, então é por esse usuário que você entra no sistema.

### 3. Frontend

```bash
cd constructflow-frontend
cp .env.example .env
npm ci
npm run dev
```

O painel fica disponível em `http://localhost:5173`.

### 4. Dados de demonstração (opcional)

Com a API rodando e o banco vazio:

```bash
./scripts/seed-dev.sh
```

O script entra como o administrador inicial e cria usuários de cada papel, obras e documentos de exemplo. A senha dos usuários criados está no próprio script. Use apenas em ambiente local.

## Configuração

A API lê as configurações de variáveis de ambiente, com padrões voltados para desenvolvimento:

| Variável      | Padrão                                           | Descrição |
|---------------|--------------------------------------------------|-----------|
| `DB_URL`      | `jdbc:postgresql://localhost:5432/constructflow` | URL JDBC do PostgreSQL |
| `DB_USER`     | `postgres`                                       | Usuário do banco |
| `DB_PASS`     | `postgres`                                       | Senha do banco |
| `ADMIN_EMAIL` | —                                                | Email do administrador inicial (criado se não houver nenhum ADMIN) |
| `ADMIN_SENHA` | —                                                | Senha do administrador inicial (mín. 6 caracteres) |
| `ADMIN_NOME`  | `Administrador`                                  | Nome do administrador inicial |
| `JWT_SECRET`  | chave de desenvolvimento                         | Chave HMAC-SHA256 em Base64 (mín. 32 bytes). **Obrigatório definir fora do ambiente local:** `openssl rand -base64 32` |

No frontend:

| Variável       | Padrão                  | Descrição |
|----------------|-------------------------|-----------|
| `VITE_API_URL` | `http://localhost:8080` | URL base da API |

## Papéis e permissões

| Ação                                | ADMIN | ENGENHEIRO | BACKOFFICE | CAMPO |
|-------------------------------------|:-----:|:----------:|:----------:|:-----:|
| Ver obras                           | todas | as que é responsável | todas | as que está vinculado |
| Alterar status da obra              | ✅    | só as suas | —          | —     |
| Excluir obra                        | ✅    | —          | —          | —     |
| Ver e adicionar documentos          | todas | obras que acessa | todas | obras que acessa |
| Aprovar ou reprovar documentos      | ✅    | só nas suas obras | ✅  | —     |
| Excluir documentos                  | ✅    | —          | ✅         | —     |
| Criar, editar e excluir usuários    | ✅    | —          | —          | —     |

> O painel esconde as ações que o papel não pode executar, mas quem decide de fato é a API. Os pontos em aberto estão em [Roadmap](#roadmap).

## Referência da API

Todas as rotas, exceto `POST /auth/login`, exigem o cabeçalho `Authorization: Bearer <token>`.

<details>
<summary><strong>Autenticação</strong></summary>

| Método | Rota          | Descrição |
|--------|---------------|-----------|
| POST   | `/auth/login` | Recebe `{ email, senha }` e retorna o JWT (texto puro, validade de 1h) |

</details>

<details>
<summary><strong>Usuários</strong> — <code>/usuarios</code></summary>

| Método | Rota                       | Descrição |
|--------|----------------------------|-----------|
| POST   | `/usuarios`                | Cria usuário `{ nome, email, senha, papel }` (somente `ADMIN`) |
| GET    | `/usuarios`                | Lista usuários |
| GET    | `/usuarios/{id}`           | Busca por id |
| GET    | `/usuarios/email?email=`   | Busca por email |
| PATCH  | `/usuarios/{id}`           | Atualização parcial (somente `ADMIN`) |
| DELETE | `/usuarios/{id}`           | Remove usuário (somente `ADMIN`) |

</details>

<details>
<summary><strong>Obras</strong> — <code>/obras</code></summary>

| Método | Rota                    | Descrição |
|--------|-------------------------|-----------|
| POST   | `/obras`                | Cria obra `{ nome, endereco, cep, status, responsavelId }` (responsável deve ser `ENGENHEIRO`) |
| GET    | `/obras`                | Lista as obras visíveis para o usuário logado |
| GET    | `/obras/{id}`           | Busca por id |
| GET    | `/obras/status/{status}`| Filtra por status |
| PATCH  | `/obras/{id}`           | Atualização parcial |
| PATCH  | `/obras/{id}/status`    | Transição de status (respeita a máquina de estados) |
| DELETE | `/obras/{id}`           | Remove obra e seus documentos (somente `ADMIN`) |

</details>

<details>
<summary><strong>Documentos</strong> — <code>/documentos</code></summary>

| Método | Rota                                   | Descrição |
|--------|----------------------------------------|-----------|
| POST   | `/documentos`                          | Cria documento `{ nome, tipo, status, caminhoArquivo?, obraId }` |
| GET    | `/documentos`                          | Lista todos |
| GET    | `/documentos/{id}`                     | Busca por id |
| GET    | `/documentos/obras/{obraId}`           | Lista por obra |
| GET    | `/documentos/status/{status}`          | Lista por status |
| GET    | `/documentos/obras/{obraId}/status?status=` | Lista por obra e status |
| PUT    | `/documentos/{id}/status`              | Altera status `{ status }` |
| PUT    | `/documentos/{id}/nome`                | Renomeia `{ nome }` |
| DELETE | `/documentos/{id}`                     | Remove documento |

</details>

<details>
<summary><strong>Formato de erro</strong></summary>

```json
{
  "status": 400,
  "error": "Validation Error",
  "message": "Erro de validação nos campos enviados",
  "path": "/obras",
  "timestamp": "2026-01-15T10:30:00",
  "validationErrors": { "cep": "CEP deve estar no formato 00000-000" }
}
```

</details>

## Estrutura do repositório

```text
.
├── constructflow-api/          # API REST (Spring Boot)
│   └── src/main/java/.../
│       ├── controllers/        # Endpoints REST
│       ├── dto/                # Records de entrada/saída
│       ├── entities/           # Entidades JPA e enums de domínio
│       ├── exceptions/         # Exceções de negócio e handler global
│       ├── repositories/       # Spring Data JPA
│       ├── security/           # JWT, filtro e configuração do Spring Security
│       └── services/           # Regras de negócio
├── constructflow-frontend/     # Painel web (React + TypeScript)
│   └── src/
│       ├── components/         # UI reutilizável, layout e componentes de domínio
│       ├── contexts/           # Autenticação e notificações
│       ├── hooks/              # Hooks de dados (React Query) e utilitários
│       ├── lib/                # Cliente HTTP, permissões, formatação, constantes
│       ├── pages/              # Telas da aplicação
│       ├── services/           # Chamadas à API por recurso
│       └── types/              # Tipos espelhando os DTOs da API
├── scripts/seed-dev.sh         # Dados de demonstração
└── docker-compose.yml          # PostgreSQL para desenvolvimento
```

## Roadmap

- [x] Restringir `POST /usuarios` e a gestão de usuários ao papel `ADMIN`
- [ ] Autorização por papel em todos os endpoints de obras e documentos
- [ ] Endpoints para vincular e desvincular usuários de uma obra
- [ ] Upload real de arquivos (S3 ou armazenamento local)
- [ ] Migrações versionadas com Flyway
- [ ] Testes automatizados (JUnit + Testcontainers, Vitest)
- [ ] Documentação OpenAPI/Swagger
- [ ] Pipeline de CI (build, lint e testes)
- [ ] Paginação nas listagens

## Autor

**João Pedro Dantas** — [joaopldantas](https://github.com/joaopldantas)
