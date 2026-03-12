# ConstructFlow

Plataforma full-stack para gestão de obras e documentos, com API segura em Spring Boot e uma base de frontend em React.

## Visao geral
ConstructFlow simula um sistema de controle de obras: cadastro de usuários com papéis, controle de obras por status e documentos vinculados a cada obra. O foco do projeto e demonstrar camadas de API, regras de negocio e autenticacao JWT.

## Destaques
- Autenticação JWT com expiração de 1h e senha com BCrypt.
- CRUD de usuarios, obras e documentos.
- Regras de negócio: transição de status de obra e restrições por papel.
- Validação de entrada com resposta de erro padronizada.
- Frontend em React + Vite como base para evoluir a UI.

## Stack
- Backend: Java 23, Spring Boot 3.4, Spring Security, Spring Data JPA, Validation, JWT (jjwt), PostgreSQL, Lombok.
- Frontend: React 19, Vite 7, ESLint.
- Infra local: PostgreSQL, Maven.

## Requisitos
- Java 23 (JAVA_HOME apontando para o JDK 23).
- Maven 3.9+.
- Node.js 18+ e npm.
- PostgreSQL 14+ (ou compativel).

## Modelo de dominio
- Usuario (nome, email, senhaHash, papel)
- Obra (nome, endereco, status, responsavel, usuarios participantes)
- Documento (nome, tipo, status, dataUpload, obra)

Papeis: ADMIN, ENGENHEIRO, BACKOFFICE, CAMPO  
Status de obra: PLANEJADA -> EM_ANDAMENTO -> (FINALIZADA | CANCELADA)  
Status de documento: PENDENTE, APROVADO, REPROVADO  
Tipos de documento: ORCAMENTO, CONTRATO, NOTA_FISCAL, PROJETO, RELATORIO, OUTRO

## Regras de negocio e seguranca
- POST /auth/** e POST /usuarios são publicos; o restante exige JWT.
- Apenas ADMIN ou ENGENHEIRO responsável pode alterar o status da obra.
- Responsável de obra precisa ser ENGENHEIRO.
- CAMPO e ENGENHEIRO so podem criar documento em obras em que estão vinculados.
- Listagem de obras varia por papel (ADMIN/BACKOFFICE ve tudo; ENGENHEIRO ve obras que lidera; CAMPO ve obras vinculadas).

Para acessar rotas protegidas, use: `Authorization: Bearer <token>`.

## Endpoints principais
Autenticacao
- POST /auth/login

Usuarios
- POST /usuarios
- GET /usuarios
- GET /usuarios/{id}
- GET /usuarios/email?email=...
- PATCH /usuarios/{id}
- DELETE /usuarios/{id}

Obras
- POST /obras
- GET /obras
- GET /obras/{id}
- GET /obras/status/{status}
- PATCH /obras/{obraId}
- PATCH /obras/{obraId}/status
- DELETE /obras/{obraId}

Documentos
- POST /documentos
- GET /documentos
- GET /documentos/{documentoId}
- GET /documentos/obras/{obraId}
- GET /documentos/status/{status}
- GET /documentos/obras/{obraId}/status?status=...
- PUT /documentos/{documentoId}/status
- PUT /documentos/{documentoId}/nome
- DELETE /documentos/{documentoId}

## Executando localmente

### Backend
1. Se estiver no IntelliJ, importe `constructflow-api/pom.xml` como Maven Project.
2. Ajuste as credenciais em `constructflow-api/src/main/resources/application.properties`:
   - `spring.datasource.url`
   - `spring.datasource.username`
   - `spring.datasource.password`
   - `jwt.secret`
3. Suba o PostgreSQL e crie o banco `constructflow`.
4. Rode:
   - `cd constructflow-api`
   - `mvn spring-boot:run`

### Frontend
1. Rode:
   - `cd constructflow-frontend`
   - `npm install`
   - `npm run dev`

## Estrutura do repositorio
- `constructflow-api/` API Spring Boot (controllers, services, repositories, security, DTOs).
- `constructflow-frontend/` app React + Vite (base inicial de UI).

## Notas de portfolio
- Foco em API segura, regras de negócio e consistência de dados.
- Frontend está minimalista para destacar o backend; serve como base para evoluir telas, rotas e consumo de API.

## Proximos passos
- Tela de login e dashboard com consumo real da API.
- Upload real de arquivos para documentos e storage.
- Cobertura de testes (unitários e integração).
