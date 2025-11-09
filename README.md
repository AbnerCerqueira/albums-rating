# API de avaliação de álbuns

Uma API onde usuários podem adicionar ao catálogo e avaliar seus álbuns musicais favoritos.

## Tecnologias

- **TypeScript** - Linguagem de programação
- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web de alta performance
- **MongoDB + Mongoose** - Banco de dados e ODM
- **Zod** - Validação de tipos e criação de schemas
- **JWT** - Autenticação
- **Swagger/OpenAPI** - Documentação da API
- **Pino** - Sistema de logs rápido e leve
- **Vitest** - Framework de testes
- **Biome + Ultracite** - Linting e formatação de código

## Visão Geral do Projeto

Este projeto fornece uma API que permite aos usuários:
- Adicionar álbuns musicais ao catálogo do site
- Avaliar e fazer reviews dos álbuns
- Acompanhar seu histórico de avaliações

## Arquitetura

O projeto segue os princípios da arquitetura limpa com uma clara separação de responsabilidades baseado na abordagem de Domain-Driven Design:

```
src/
├── contexts/     # Contextos delimitados
│   ├── domain/      # Regras e lógica de negócio
│   └── application/ # Casos de uso e orquestração
├── infra/        # Camada de infraestrutura (configs, logs, etc)
└── presentation/ # Rotas HTTP e endpoints da API
```

## Começando

1. Clone o repositório
2. Instale as dependências:
```bash
npm i
```

3. Crie seu arquivo `.env.development` com as variáveis de ambiente necessárias

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Testes

Execute a suite de testes:

```bash
npm run test
```

## Documentação da API

Com o servidor em execução, você pode acessar:
- Documentação Swagger UI em `/docs`
