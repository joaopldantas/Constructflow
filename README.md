# ConstructFlow

Monorepo com backend em Spring Boot e frontend em React/Vite.

## Estrutura

```text
constructflow-api/        # API (Java + Spring Boot)
constructflow-frontend/   # Frontend (React + Vite)
```

## Stack

- Backend: Java 23, Spring Boot 3.4, Maven, PostgreSQL
- Frontend: React 19, Vite 7, npm

## Como rodar localmente

Prerequisitos:
- Java 23+
- Node.js 18+
- PostgreSQL 14+

Backend:

```bash
cd constructflow-api
./mvnw spring-boot:run
```

Frontend:

```bash
cd constructflow-frontend
npm ci
npm run dev
```

## Configuração do banco (API)

Arquivo: `constructflow-api/src/main/resources/application.properties`

Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/constructflow
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Documentação por módulo

- API: [`constructflow-api/README.md`](constructflow-api/README.md)
- Frontend: [`constructflow-frontend/README.md`](constructflow-frontend/README.md)