# ConstructFlow API

Backend Spring Boot do monorepo ConstructFlow.

## Rodar localmente

Prerequisitos:
- Java 23+
- PostgreSQL 14+

```bash
./mvnw spring-boot:run
```

## Configuração

Arquivo: `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/constructflow
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Referência

Documentacao geral do projeto: [`../README.md`](../README.md)
