# AGENTS.md

API REST de avaliação de álbuns, praticando DDD com TypeScript + Node.js.
Prioridade: **legibilidade** e **manutenibilidade a longo prazo**. Siga os padrões já existentes na base — não invente um novo jeito de fazer algo que já tem exemplo.

## Definição de pronto

Antes de entregar qualquer task:

- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] Se mexeu em fluxo HTTP, suba o servidor e teste o endpoint de verdade
- [ ] Releia o próprio código — a primeira versão que passa nos testes não é a entrega final

## Estrutura

Contextos: `user` (usuários), `catalog` (álbuns), `rating` (reviews), `common` (utilitários).

Cada contexto: `domain/ -> application/ -> infra/`

**Regra de dependência: a seta aponta pra dentro.** `domain` não importa nada de `application`/`infra`. Se `infra` precisa expor algo pro domínio, o domínio define a interface e a `infra` implementa.

## Padrões de código

- **Erro previsível** (validação, "não encontrado", regra de negócio) → retorna `Result`, não lança exceção. Reusar o `Result` que já existe em `common`.
- **Erro imprevisível** (bug, falha de infra) → `try/catch` + relançar como erro customizado do projeto (reusar classes de `common` antes de criar nova).
- **Logs** sempre pelo logger do projeto, nunca `console.log`. Nível com intenção: `debug` (detalhe de investigação), `info` (evento relevante do fluxo), `warn` (algo estranho mas recuperável), `error` (falha real).
- Não duplicar código — se repetir, extrair pra `common` ou pro helper do contexto.
- Pode editar código existente, contanto que mantenha esses padrões e não quebre testes.

## Scripts (npm)

`typecheck` · `build` · `lint` · `test` (Vitest) · `dev`/`start` (sobe servidor)
