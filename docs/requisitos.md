# Requisitos e regras atuais

## Objetivo do documento

Este arquivo descreve o comportamento atual do sistema com base no código existente, não o comportamento ideal.

O objetivo é servir como referência para:

- lembrar as histórias e fluxos já implementados
- registrar onde as regras vivem hoje
- facilitar a atualização futura dos testes
- deixar explícitos os pontos que merecem refatoração

## Como ler este documento

As regras abaixo foram extraídas do comportamento implementado em:

- domínio (`value objects`, entidades e serviços)
- casos de uso
- rotas HTTP
- schemas Zod
- persistência Mongoose

Quando houver diferença entre o que seria desejável e o que o sistema realmente faz hoje, este documento prioriza o comportamento real.

## Visão geral das interfaces públicas

Atualmente a API pública exposta é:

- `GET /api/`
- `POST /api/user`
- `POST /api/user/login`
- `POST /api/catalog`
- `GET /api/catalog`
- `GET /api/catalog/search`
- `GET /api/catalog/search/available-genres`
- `GET /api/catalog/:publicId`

O contexto `rating` já tem domínio e persistência, mas ainda não possui interface HTTP pública.

## Contexto `user`

### História: cadastrar usuário

**Objetivo do usuário**

Como visitante, quero criar uma conta para poder me identificar no sistema.

**Endpoint atual**

- `POST /api/user`

**Fluxo atual**

1. A rota recebe `email`, `username` e `password`.
2. O request passa por schema Zod.
3. O caso de uso recria as validações principais com `Email`, `Username` e `Password`.
4. O serviço de domínio verifica se já existe um usuário com o mesmo id de domínio.
5. A senha é criptografada antes da persistência.
6. A resposta retorna apenas `email`, `username` e `publicId`.

**Regras de negócio atuais**

- `email` deve ser válido.
  Origem atual: `Email.create`.
- `username` deve ter no mínimo 3 caracteres.
  Origem atual: `Username.create`.
- `username` deve ter no máximo 100 caracteres.
  Origem atual: `Username.create`.
- `password` deve ter no mínimo 6 caracteres.
  Origem atual: `Password.create`.
- `password` deve ter no máximo 100 caracteres.
  Origem atual: `Password.create`.
- Um usuário é considerado duplicado quando já existe o mesmo par `email + username`.
  Origem atual: `UserId`, `IsUniqueUser` e índice único no Mongo.
- A senha não é retornada na resposta.
  Origem atual: `UserDTOMapper`.

**Validações técnicas e restrições atuais**

- O body HTTP exige `email`, `username` e `password`.
  Origem atual: `zodCreateUserUseCaseRequest`.
- O schema HTTP valida `email` com `z.email()`.
  Origem atual: `zodCreateUserUseCaseRequest`.
- A persistência também reforça unicidade por `domainId.email + domainId.username`.
  Origem atual: índice único em `user-model`.
- `publicId` é gerado como UUIDv7.
  Origem atual: `PublicId`.

**Respostas observáveis**

- `201 Created` com `email`, `username` e `publicId`.
- `400 Bad Request` para argumentos inválidos.
- `409 Conflict` quando o usuário já existe.

**Cenários úteis para testes**

- cadastro com email válido, username válido e senha válida
- cadastro com email inválido
- cadastro com username menor que 3
- cadastro com username maior que 100
- cadastro com senha menor que 6
- cadastro com senha maior que 100
- cadastro duplicado com mesmo `email + username`

**O que refatorar depois**

- Extrair um input model ou command de criação para separar melhor parsing HTTP de regra de negócio.
- Reduzir duplicidade de validação entre Zod e value objects.
- Avaliar se o conceito de unicidade do usuário deve continuar sendo o par `email + username` ou se `email` sozinho deveria ser único.

### História: autenticar usuário

**Objetivo do usuário**

Como usuário cadastrado, quero fazer login para receber um token de autenticação.

**Endpoint atual**

- `POST /api/user/login`

**Fluxo atual**

1. A rota recebe `email` e `password`.
2. O body passa por schema Zod.
3. O caso de uso valida o email novamente com `Email.create`.
4. O repositório busca usuário pelo email.
5. A senha informada é comparada com o hash persistido.
6. Em caso de sucesso, a rota gera um JWT.

**Regras de negócio atuais**

- O email informado precisa ser válido.
  Origem atual: `Email.create`.
- Se nenhum usuário for encontrado para o email, o sistema retorna erro genérico de credenciais inválidas.
  Origem atual: `AuthUseUseCase`.
- Se a senha estiver incorreta, o sistema retorna o mesmo erro genérico de credenciais inválidas.
  Origem atual: `AuthUseUseCase`.
- O token é gerado com `sub = username`.
  Origem atual: `auth-user-route`.
- O token expira em `1d`.
  Origem atual: `auth-user-route` e configuração JWT da aplicação.

**Validações técnicas e restrições atuais**

- O body HTTP exige `email` e `password`.
  Origem atual: `zodAuthUserUseCaseRequest`.
- O schema HTTP valida `email` com `z.email()`.
  Origem atual: `zodAuthUserUseCaseRequest`.
- No login, `password` é apenas `z.string()`.
  Origem atual: `zodAuthUserUseCaseRequest`.
- Não existe regra explícita de tamanho mínimo da senha no fluxo de autenticação.
  Origem atual: comportamento atual do caso de uso.

**Respostas observáveis**

- `200 OK` com `{ token }`.
- `400 Bad Request` para email inválido ou credenciais inválidas.

**Cenários úteis para testes**

- login com email válido e senha correta
- login com email inválido
- login com email inexistente
- login com senha incorreta
- verificação de que o token é retornado no sucesso

**O que refatorar depois**

- Mover a modelagem do input de autenticação para algo mais próximo do domínio/aplicação, deixando Zod mais focado no transporte HTTP.
- Tornar explícita a política da senha no login, em vez de deixar a ausência de validação forte como comportamento implícito.
- Rever se `username` deve mesmo ser usado como `sub` do token ou se `publicId` seria uma identidade mais estável.
- Considerar `401 Unauthorized` para credenciais inválidas, já que hoje tudo volta como `400`.

## Contexto `catalog`

### História: cadastrar álbum

**Objetivo do usuário**

Como usuário do sistema, quero cadastrar um álbum no catálogo.

**Endpoint atual**

- `POST /api/catalog`

**Fluxo atual**

1. A rota recebe `title`, `artist`, `releaseDate`, `genre` e `format`.
2. O body passa por schema Zod.
3. O caso de uso valida apenas o `title` com value object.
4. O id de domínio do álbum é formado por `title + artist`.
5. O serviço de domínio verifica duplicidade.
6. O álbum é persistido e retornado em DTO.

**Regras de negócio atuais**

- `title` não pode exceder 200 caracteres.
  Origem atual: `Title.create`.
- `format` só aceita `LP`, `EP`, `Single`, `Compilation` ou `Live`.
  Origem atual: `FORMATS` e schemas associados.
- O álbum é considerado duplicado quando já existe o mesmo par `title + artist`.
  Origem atual: `AlbumId`, `IsUniqueAlbum` e índice único no Mongo.
- `releaseDate` é convertida para `Date` e devolvida no DTO como data ISO no formato `YYYY-MM-DD`.
  Origem atual: `CreateAlbumsUseCase` e `AlbumDTOMapper`.

**Validações técnicas e restrições atuais**

- O body HTTP exige `title`, `artist`, `releaseDate`, `genre` e `format`.
  Origem atual: `zodCreateAlbumUseCaseRequest`.
- `releaseDate` precisa entrar como data ISO válida.
  Origem atual: `z.iso.date()`.
- Não há validação de domínio específica para `artist`.
  Origem atual: comportamento atual.
- Não há validação de domínio específica para `genre`.
  Origem atual: comportamento atual.
- A rota possui um `TODO` para autenticação e hoje aceita criação sem middleware de acesso.
  Origem atual: `create-album-route`.
- `publicId` é gerado como UUIDv7.
  Origem atual: `PublicId`.

**Respostas observáveis**

- `200 OK` com o álbum criado.
- `400 Bad Request` para dados inválidos.
- `409 Conflict` quando o álbum já existe.

**Cenários úteis para testes**

- cadastro válido de álbum
- cadastro com `title` acima de 200 caracteres
- cadastro com `format` inválido
- cadastro com `releaseDate` inválida
- cadastro duplicado com mesmo `title + artist`
- cadastro sem autenticação, confirmando o comportamento atual

**O que refatorar depois**

- Extrair `artist`, `genre` e possivelmente `releaseDate` para value objects ou regras de domínio próprias.
- Decidir se a criação deve responder com `201 Created` em vez de `200 OK`.
- Implementar autorização/autenticação para criação de álbum.
- Reduzir a dependência de regras de negócio expressas só no Zod.

### História: listar álbuns

**Objetivo do usuário**

Como cliente da API, quero listar os álbuns cadastrados.

**Endpoint atual**

- `GET /api/catalog`

**Fluxo atual**

1. A rota lê `page` e `size` da querystring.
2. Se ambos estiverem presentes, tenta criar um objeto de paginação.
3. O repositório busca os álbuns com ou sem `skip/limit`.
4. A resposta devolve `albums`, `currentPage` e `size`.

**Regras de negócio atuais**

- A paginação só é efetivamente aplicada quando `page` e `size` são enviados juntos.
  Origem atual: `InfraSchemaUtils.validatePagination`.
- `page` e `size` devem ser maiores que zero quando usados.
  Origem atual: `Pagination.create`.

**Validações técnicas e restrições atuais**

- `page` e `size` são convertidos para número via Zod.
  Origem atual: `paginationQuerystring`.
- Se apenas um dos dois for enviado, a rota não erra; apenas ignora a paginação.
  Origem atual: `validatePagination`.
- A resposta não informa total de registros.
  Origem atual: contrato atual da rota.

**Respostas observáveis**

- `200 OK` com `{ albums, currentPage?, size? }`.
- `400 Bad Request` quando `page` e `size` existem, mas são inválidos.

**Cenários úteis para testes**

- listagem sem paginação
- listagem com paginação válida
- listagem com `page` ou `size` igual a zero
- listagem com só `page`
- listagem com só `size`

**O que refatorar depois**

- Decidir se o envio parcial de paginação deve ser erro explícito em vez de ser ignorado.
- Adicionar metadados mais completos de paginação, se isso fizer sentido para a API.

### História: buscar álbuns por filtros

**Objetivo do usuário**

Como cliente da API, quero buscar álbuns por campos de texto e formato.

**Endpoint atual**

- `GET /api/catalog/search`

**Fluxo atual**

1. A rota aceita filtros opcionais de `title`, `artist`, `genre` e `format`.
2. Também aceita opções de busca `matchType` e `combineWith`.
3. A paginação é validada com a mesma regra da listagem.
4. O repositório monta um pipeline de busca textual.

**Regras de negócio atuais**

- Os filtros de texto disponíveis são `title`, `artist` e `genre`.
  Origem atual: contrato do repositório e rota.
- O filtro de formato aceita uma lista de formatos válidos.
  Origem atual: normalização da rota e enum de `FORMATS`.
- `matchType` aceita `perfect` e `startsWith`.
  Origem atual: `MATCH_TYPES`.
- `combineWith` aceita `and` e `or`.
  Origem atual: `COMBINE_WITH`.
- Quando `matchType = perfect`, a comparação textual é por igualdade exata.
  Origem atual: `MongooseUtils.buildSearchStringPipeline`.
- Quando `matchType = startsWith`, a comparação usa regex case-insensitive com prefixo.
  Origem atual: `MongooseUtils.buildSearchStringPipeline`.
- Quando `combineWith = and`, os filtros válidos são combinados no mesmo `$match`.
  Origem atual: `MongooseUtils.buildSearchStringPipeline`.
- Quando `combineWith = or`, cada filtro vira uma condição em `$or`.
  Origem atual: `MongooseUtils.buildSearchStringPipeline`.
- Valores em branco são descartados da busca.
  Origem atual: `MongooseUtils.buildSearchStringPipeline`.

**Validações técnicas e restrições atuais**

- `matchType` e `combineWith` têm defaults `perfect` e `and`.
  Origem atual: `searchStringOptionsQuerystring`.
- `format` pode vir como valor único ou array e é normalizado na rota.
  Origem atual: `normalizeFormatQuery`.
- Sem filtros válidos, a busca retorna o mesmo comportamento de uma listagem simples.
  Origem atual: repositório de álbum.
- A resposta não informa total de resultados.
  Origem atual: contrato atual da rota.

**Respostas observáveis**

- `200 OK` com `{ albums, currentPage?, size? }`.
- `400 Bad Request` para paginação inválida ou formato inválido.

**Cenários úteis para testes**

- busca só por `title`
- busca só por `artist`
- busca só por `genre`
- busca só por `format`
- busca com múltiplos formatos
- busca com `combineWith=and`
- busca com `combineWith=or`
- busca com `matchType=perfect`
- busca com `matchType=startsWith`
- busca com filtro em branco

**O que refatorar depois**

- Separar melhor filtros de negócio e opções técnicas de busca no contrato da API.
- Avaliar se parte desse comportamento de busca merece modelagem própria em aplicação/domínio.

### História: consultar álbum por `publicId`

**Objetivo do usuário**

Como cliente da API, quero consultar um álbum específico pelo identificador público.

**Endpoint atual**

- `GET /api/catalog/:publicId`

**Fluxo atual**

1. A rota valida `publicId`.
2. O repositório busca o álbum por identificador público.
3. Se existir, retorna DTO.
4. Se não existir, retorna erro de não encontrado.

**Regras de negócio atuais**

- O identificador público do álbum é separado do id de domínio.
  Origem atual: `PublicId` e DTOs.

**Validações técnicas e restrições atuais**

- `publicId` precisa ser UUIDv7.
  Origem atual: schema da rota com `z.uuidv7()`.

**Respostas observáveis**

- `200 OK` com o álbum.
- `404 Not Found` com mensagem `Album não encontrado`.

**Cenários úteis para testes**

- consulta de álbum existente por `publicId`
- consulta com `publicId` inválido
- consulta com `publicId` inexistente

**O que refatorar depois**

- Avaliar se a validação de `publicId` merece um value object próprio para uso consistente entre camadas.

### História: consultar gêneros disponíveis

**Objetivo do usuário**

Como cliente da API, quero descobrir gêneros disponíveis no catálogo.

**Endpoint atual**

- `GET /api/catalog/search/available-genres`

**Fluxo atual**

1. A rota aceita um filtro opcional de `genre`.
2. Reutiliza a infraestrutura de busca textual.
3. A resposta retorna um array de gêneros a partir dos álbuns encontrados.

**Regras de negócio atuais**

- A busca de gêneros usa `matchType = perfect` por padrão.
  Origem atual: `defaultSearchStringOptions`.
- Nessa rota não existe `combineWith`.
  Origem atual: schema da rota.
- O retorno pode conter valores repetidos, porque não há deduplicação dos gêneros encontrados.
  Origem atual: `genre-search-routes`.

**Validações técnicas e restrições atuais**

- A rota aceita paginação com o mesmo comportamento das outras buscas.
- O filtro é apenas `genre`.

**Respostas observáveis**

- `200 OK` com `{ genres, currentPage?, size? }`.
- `400 Bad Request` para paginação inválida.

**Cenários úteis para testes**

- consulta sem filtro
- consulta com filtro por prefixo
- consulta paginada
- validação de que o retorno hoje pode ter gêneros repetidos

**O que refatorar depois**

- Decidir se a API deve retornar gêneros únicos.
- Avaliar se essa rota deveria expor melhor a intenção de autocomplete/sugestão.

## Contexto `rating`

### Observação geral

O contexto `rating` já possui contrato de repositório, entidade e persistência, mas ainda não está exposto por rotas HTTP nem por casos de uso públicos.

As histórias abaixo são inferidas do código existente e não devem ser tratadas como interface pública já disponível.

### História inferida: registrar avaliação

**Objetivo inferido**

Permitir que um usuário registre uma avaliação para um álbum.

**Regras atuais inferidas**

- A avaliação é identificada pelo par `usuário + álbum`.
  Origem atual: `ReviewId`.
- Só pode existir uma avaliação por combinação de `user + album`.
  Origem atual: índice único em `review-model`.
- `rating` deve ficar entre `1` e `10`.
  Origem atual: schema Mongoose.
- `isFavorite` existe e começa com `false`.
  Origem atual: schema Mongoose.
- `isEdited` existe e começa com `false`.
  Origem atual: schema Mongoose.
- `reviewedAt` é obrigatório.
  Origem atual: schema Mongoose.
- `publicId` existe mesmo sem rota pública.
  Origem atual: persistência e mapper.

**O que refatorar depois**

- Levar a regra da nota para o domínio em vez de deixá-la só no model.
- Criar caso de uso explícito para criação de review.
- Decidir se flags como `isEdited` devem ser manipuladas por comportamento da entidade.

### História inferida: listar avaliações

**Objetivo inferido**

Permitir recuperar avaliações recentes, por usuário ou por álbum.

**Regras atuais inferidas**

- Existe listagem por usuário.
  Origem atual: `findByUser`.
- Existe listagem por álbum.
  Origem atual: `findByAlbum`.
- Existe listagem de avaliações recentes.
  Origem atual: `findRecent`.
- A ordenação padrão é por `reviewedAt` decrescente.
  Origem atual: repositório Mongoose.
- Todas essas consultas aceitam paginação.
  Origem atual: contrato do repositório.

**O que refatorar depois**

- Explicitar esses casos de uso em aplicação antes de abrir interface HTTP.
- Documentar quais filtros e ordenações são realmente desejados como regra de produto.

### História inferida: editar ou remover avaliação

**Objetivo inferido**

Permitir atualizar ou excluir uma avaliação existente.

**Regras atuais inferidas**

- Existe atualização de review por id de domínio composto.
  Origem atual: `update`.
- Existe remoção de review por id de domínio composto.
  Origem atual: `delete`.
- Não há regra de domínio explícita para transição de estado ao editar uma review.
  Origem atual: comportamento atual.

**O que refatorar depois**

- Mover comportamento de edição para entidade/agregado.
- Definir regras de alteração de `rating`, `isFavorite`, `isEdited` e `reviewedAt` fora da persistência.

## Cross-cutting

### Regras e decisões atuais

- Erros de domínio retornam apenas `message`.
  Origem atual: `DomainError` e schemas de erro HTTP.
- Parte das regras está no domínio, parte em Zod e parte em índices/schema do banco.
- A unicidade de usuário e álbum é verificada por serviço de domínio e reforçada na persistência.
- A paginação é compartilhada por helper comum.
- Busca textual e opções de combinação também são centralizadas em helper comum.
- O health check público responde com `{ "message": "OK" }` em `GET /api/`.

### Gaps e dívida de modelagem

- Existem regras de negócio importantes ainda presas ao transporte HTTP.
  Exemplos: formatos aceitos e validação do request de login.
- Existem regras importantes presas à persistência.
  Exemplos: faixa de nota de review e defaults de flags.
- Algumas políticas atuais estão implícitas demais para testes.
  Exemplos: paginação parcial ser ignorada e gêneros repetidos na busca de gêneros.
- O contexto `rating` está avançado na persistência, mas sem contrato público claro.

### O que refatorar depois

- Concentrar regras de negócio em domínio e aplicação.
- Deixar Zod mais focado em parsing, shape e serialização de HTTP.
- Reduzir o número de regras cujo comportamento real depende do model do banco.
- Formalizar os fluxos de `rating` antes de expor novas rotas.
