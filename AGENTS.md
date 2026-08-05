# AGENTS.md

API REST de avaliação de álbuns, praticando DDD com TypeScript + Node.js.

Prioridades:
1. Manter os padrões existentes do projeto.
2. Preservar legibilidade e manutenibilidade a longo prazo.
3. Evitar complexidade desnecessária.
4. Implementar soluções simples e bem tipadas.

Antes de criar um novo padrão, abstração ou estrutura, procure uma implementação existente que resolva um problema semelhante. Caso o problema seja novo, escolha uma solução consistente com a arquitetura atual e documente decisões não óbvias.

## Definição de pronto

Antes de entregar qualquer task:

- [ ] Implementação concluída seguindo os padrões existentes
- [ ] Testes adicionados ou atualizados quando houver mudança de comportamento
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] Se mexeu em fluxo HTTP, suba o servidor e teste o endpoint de verdade
- [ ] Releia o próprio código — a primeira versão que passa nos testes não é a entrega final

## Testes

- Toda nova feature deve incluir testes automatizados.
- Ao corrigir um bug, adicione um teste que reproduza o comportamento antes de corrigir, evitando regressões futuras.
- Antes de implementar uma feature, identifique os comportamentos principais que precisam ser garantidos e cubra esses cenários com testes.
- Prefira testes de comportamento em vez de testes focados em implementação interna.
- Teste regras de negócio no `domain`/`application` sem depender de infraestrutura quando possível.
- Para fluxos HTTP, adicione testes de integração quando o comportamento depender da comunicação entre camadas.
- Não remova ou enfraqueça testes existentes apenas para fazer uma implementação passar.
- Não crie testes apenas para aumentar cobertura. Priorize cenários que protegem regras de negócio e comportamentos relevantes.

## TypeScript - Tipagem

- Evite casts de tipagem (`as`, `<>`). Utilize somente quando não existir uma alternativa segura usando o sistema de tipos do TypeScript.
- Nunca use casts para ignorar erros do compilador.
- Antes de criar um novo tipo, procure tipos existentes e reutilize-os quando representarem o mesmo conceito.
- Evite tipos inline complexos. Prefira tipos nomeados quando melhorarem legibilidade, reutilização ou manutenção.
- Evite `unknown`. Quando for inevitável, faça validação explícita e narrowing antes de utilizar o valor.
- Prefira soluções que mantenham inferência, segurança de tipos e validação em tempo de compilação.

## Estrutura

Contextos existentes:
- `user`: usuários
- `catalog`: álbuns
- `rating`: reviews
- `stats`: rankings (cache materializado + job)
- `shared`: conceitos de domínio compartilhados entre contextos (`PublicId`, projeções de chart, contadores de review)
- `!common`: apenas utilitários (`result`, `errors`, `pagination`, `slugify`, `event-bus`...)

Estrutura de cada contexto:

- domain/
- application/
- infra/

`shared` e `!common` não seguem essa estrutura de camadas: são bibliotecas sem dependência de outros contextos, consumíveis por qualquer um deles.

Regra de dependência: a dependência aponta para dentro.

- `domain` não pode depender de `application` ou `infra`.
- `application` pode depender de `domain`.
- `infra` pode depender de `application` e `domain`.
- Se a infraestrutura precisar expor uma capacidade ao domínio, o domínio deve definir a interface e a infraestrutura deve implementá-la.

## Padrões de código

### Tratamento de erros

- Erros previsíveis (validação, entidade não encontrada, regra de negócio):
  - Retornar `Result`.
  - Reutilizar o `Result` existente em `common`.

- Erros imprevisíveis (bugs, falhas de infraestrutura):
  - Usar `try/catch` quando necessário.
  - Converter para erros customizados existentes no projeto.
  - Criar novos erros somente quando não existir uma alternativa adequada.

### Logs

- Nunca utilizar `console.log`.
- Utilizar sempre o logger do projeto.
- Escolher o nível pelo objetivo:
  - `debug`: informações para investigação.
  - `info`: eventos relevantes do fluxo.
  - `warn`: situações inesperadas mas recuperáveis.
  - `error`: falhas reais.

### Gateways

Gateway é a ponte entre contextos: permite que um contexto consuma dados de outro sem conhecer o repositório ou as entidades do provedor.

- A interface (porta) vive no `domain` do **contexto consumidor** (`{consumidor}/domain/gateways/*-gateway.ts`) e usa apenas tipos do próprio contexto + `shared`/`!common` (`PublicId`, `Result`, erros, projeções compartilhadas).
- A implementação (adapter) vive no `infra` do **contexto provedor** (`{provedor}/infra/gateways/*-gateway.ts`), recebendo somente repositórios do próprio provedor.
- O contrato retorna DTOs mínimos do consumidor — nunca entidades do provedor. Se o consumidor só precisa do ID, retorne `Result<{ id }>, NotFoundError`.
- O provedor expõe o adapter pelo seu `compose.ts`; o consumidor injeta nos use-cases (nunca importa o repositório do provedor).
- Um gateway por contexto estrangeiro: se o consumidor depende de dois contextos, crie dois gateways.

### Código

- Evite duplicação, mas não crie abstrações prematuras.
- Antes de extrair código, confirme que existe uma responsabilidade reutilizável.
- Prefira helpers específicos do contexto quando a lógica não for realmente compartilhada.
- Pode alterar código existente quando necessário, desde que preserve os padrões arquiteturais e não introduza regressões.

## Scripts disponíveis

- `typecheck`
- `build`
- `lint`
- `test` (Vitest)
- `dev` / `start` (servidor)
