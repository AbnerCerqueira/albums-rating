# API REST de avaliação de álbuns

API REST construída em TypeScript com Node.js para praticar modelagem de domínio em um contexto familiar: usuários, catálogo de álbuns e a base para avaliações musicais.

Hoje o projeto já entrega cadastro e autenticação de usuários, criação e consulta de álbuns e uma estrutura de domínio preparada para evoluir o contexto de reviews sem acoplar essa expansão ao restante da aplicação.

## O que o projeto faz hoje

Hoje o projeto já cobre os seguintes fluxos de usuário:

**User**

- Visitantes podem criar uma conta para se identificar no sistema.
- Usuários cadastrados podem se autenticar e receber um token JWT para acessar fluxos protegidos.

**Catalog**

- Usuários autenticados podem cadastrar álbuns no catálogo.
- API pode listar os álbuns já cadastrados, com suporte a paginação opcional.
- API pode buscar álbuns por título, artista, gênero e formato.
- API pode consultar um álbum específico por identificador público.
- API pode consultar os gêneros atualmente presentes no catálogo.

**Rating**

- Ainda não foi implementado

## Objetivo do projeto

Este projeto foi desenvolvido como exercício prático de design de software, com foco em:

- Modelagem de domínio com responsabilidades bem definidas
- Baixo acoplamento entre módulos
- Alta coesão por contexto
- Regras de negócio encapsuladas
- Arquitetura simples, com poucas camadas e fácil evolução

Em vez de perseguir uma estrutura excessivamente abstrata, a proposta foi manter a arquitetura enxuta e deixar as decisões de modelagem mais explícitas no código.

## Organização da arquitetura

O projeto é organizado por contextos, separando domínio, aplicação e infraestrutura de forma direta:

```text
src/
├── contexts/
│   ├── nome-contexto/
│   │   ├── application/
│   │   ├── domain/
│   │   └── infra/
│   └── !common/
├── infra/
│   ├── config/
│   ├── http/
│   └── lib/
├── app.ts
├── main.ts
└── server.ts
```

Dentro dessa estrutura:

- `domain` concentra entidades, value objects, contratos e regras centrais
- `application` organiza casos de uso e orquestra fluxos
- `infra` implementa HTTP, persistência, autenticação, logging e composição

Essa divisão permite evoluir regras e casos de uso sem espalhar decisões de negócio por toda a aplicação, mesmo reconhecendo que algumas validações ainda estão em Zod e na persistência.

## Tecnologias

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime da aplicação
- **Fastify** - Camada HTTP
- **MongoDB + Mongoose** - Persistência
- **Zod** - Validação e schemas
- **JWT** - Autenticação
- **Swagger/OpenAPI** - Documentação da API em desenvolvimento
- **Pino** - Logging
- **Vitest** - Testes unitários, de integração e e2e
- **Biome + Ultracite** - Lint e formatação

## Testes

O projeto possui cobertura de testes em diferentes níveis:

- `unit`
  Valida regras e comportamentos isolados do domínio.
- `e2e`
  Exercita os fluxos HTTP principais.

## Documentação da API

Com a aplicação em execução no ambiente de desenvolvimento, a documentação Swagger UI fica disponível em:

- `/docs`

## Executando o projeto

1. Instale as dependências:

```bash
npm i
```

2. Crie o arquivo `.env.development` com as variáveis necessárias.
```bash
ainda n precisa de nenhuma env
```

3. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```
