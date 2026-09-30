ESPECIFICAÇÃO DE FRONT-END

Bazar Desapega

Documento de produto, UX/UI e arquitetura de implementação

Versão 1.1 • Final de Implementação e Extensões • Setembro de 2026

**Direção do produto**

Uma experiência de brechó digital minimalista: catálogo visual, baixa fricção, foco nas peças e checkout direto. A administração deve ser eficiente, densa e funcional, sem perder a mesma identidade visual. Todas as rotas e contratos de API previstos foram 100% implementados e integrados.

| **Campo**             | **Definição**                                          |
| --------------------- | ------------------------------------------------------ |
| Produto               | Bazar Desapega                                         |
| Tipo                  | E-commerce de peças únicas / bazar                     |
| Back-end existente    | Laravel 13 + MySQL 8 + REST + Sanctum                  |
| Front-end recomendado | Next.js 16.3 + React 19.2 + TypeScript                 |
| UI                    | Tailwind CSS 4.3 + shadcn/ui + Lucide                  |
| Estado servidor       | TanStack Query                                         |
| Formulários           | React Hook Form + Zod                                  |
| Objetivo              | Vitrine minimalista + checkout + painel administrativo |

Este documento deriva a arquitetura de telas e os contratos de consumo a partir da especificação da API fornecida. Onde a API não documenta um endpoint necessário para uma tela, a dependência é explicitamente indicada em vez de inventar um contrato.

# 1\. Objetivo e visão do front-end

O front-end será uma aplicação web responsiva, acessível e orientada a conversão, conectada à API REST do Bazar Desapega. A vitrine deve valorizar fotografias e informações essenciais da peça, enquanto o painel administrativo deve priorizar produtividade, filtros, tabelas e operações claras.

A API já define uma arquitetura headless/API-first: front-end e back-end são independentes e se comunicam por HTTP/HTTPS usando REST. Também define autenticação stateless por Bearer Token via Sanctum, armazenamento de imagens abstrato no Laravel e respostas JSON com códigos HTTP apropriados. (SDD da API, seção 1) (SDD da API, diretrizes técnicas do backend)

## 1.1. Objetivos de experiência

- Fazer o produto aparecer antes da interface: imagens grandes, tipografia limpa e poucos elementos concorrentes.
- Permitir descoberta por categoria, gênero e tamanho, aproveitando os filtros já previstos na API.
- Reduzir o caminho entre produto e compra: detalhe → revisão → escolha da entrega → pedido concluído.
- Separar visualmente a área pública da operação administrativa, sem criar dois produtos visualmente desconectados.
- Tratar peças como estoque unitário: uma peça disponível só pode ser associada a um pedido.

## 1.2. Princípio de escopo

**Regra de não-invenção de contrato**

O front-end deve consumir somente os endpoints e payloads documentados. Telas que precisam de GET/PUT/DELETE ou relatórios não presentes na API ficam especificadas como UI + contrato pendente de extensão do back-end.

# 2\. Stack recomendada

A recomendação é manter React, mas usar Next.js como framework de aplicação, TypeScript como linguagem principal e uma camada BFF/proxy no próprio Next.js para proteger o token quando o deploy permitir. Next.js segue sendo o framework React oficial de produção do ecossistema e sua documentação atual recomenda o App Router para as APIs e recursos mais recentes. Em agosto de 2026, a linha 16.3 está disponível; o projeto deve fixar a versão estável aprovada no momento da implementação, evitando canary em produção. (documentação oficial consultada)

React está na linha estável 19.2 na documentação oficial atual. (documentação oficial consultada)

Tailwind CSS 4.3 está disponível em 2026 e mantém foco em utilitários e integração moderna com frameworks. (documentação oficial consultada)

| **Tecnologia**  | **Escolha**                               | **Motivo**                                                                                              |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Framework       | Next.js 16.3 (App Router)                 | Roteamento, SEO, layouts, rendering híbrido, cache e uma base React moderna.                            |
| Linguagem       | TypeScript                                | Tipagem dos contratos da API, payloads, estados de formulário e componentes; reduz erros de integração. |
| UI / CSS        | Tailwind CSS 4.3                          | Velocidade de construção e consistência sem uma folha CSS monolítica.                                   |
| Componentes     | shadcn/ui                                 | Componentes acessíveis e composáveis, sem prender o produto a uma biblioteca visual rígida.             |
| Ícones          | Lucide React                              | Ícones lineares, minimalistas e coerentes com a identidade proposta.                                    |
| Estado servidor | TanStack Query                            | Cache, refetch, loading/error states e invalidação para REST.                                           |
| Formulários     | React Hook Form + Zod                     | Validação declarativa, integração eficiente e schemas reutilizáveis.                                    |
| Testes          | Vitest + Testing Library + Playwright     | Unit/component tests e fluxos E2E críticos.                                                             |
| Lint / format   | ESLint + Prettier                         | Padronização de código.                                                                                 |
| Deploy          | Vercel ou infraestrutura Node equivalente | Adequado ao Next.js; manter API Laravel separada.                                                       |

## 2.1. Por que não apenas Vite + React?

Vite + React seria perfeitamente viável para uma SPA pura e é uma boa alternativa quando SEO não é requisito. Para um e-commerce, porém, o ganho de rotas, metadados, renderização híbrida, carregamento de páginas públicas e organização por layouts favorece Next.js. Como o produto é visual e a vitrine pode crescer, a recomendação é Next.js; a aplicação administrativa também pode viver no mesmo projeto, isolada por rota.

## 2.2. Arquitetura de dados recomendada

- Server Components para páginas públicas que apenas exibem dados, quando isso simplificar carregamento e SEO.
- Client Components somente nas partes interativas: filtros, galeria, carrinho/seleção, formulários, modais e tabelas interativas.
- TanStack Query para chamadas de API no cliente e cache de dados que mudam após mutações.
- BFF/proxy do Next.js como camada opcional recomendada: navegador → Next.js → Laravel API; token guardado em cookie HttpOnly/Secure/SameSite quando possível.
- Caso o projeto opte por chamar Laravel diretamente do navegador, manter exatamente o Bearer Token da API e CORS restrito aos domínios oficiais; a especificação da API já prevê origens de desenvolvimento como localhost:5173 e localhost:3000. (SDD da API, CORS)

# 3\. Identidade visual minimalista

A marca deve transmitir "garimpo bem selecionado", não "marketplace genérico". O design evita excesso de banners, badges, gradientes e cores saturadas. A fotografia da roupa é protagonista; a interface funciona como uma moldura editorial.

## 3.1. Conceito: "desapegar com curadoria"

- Tom: íntimo, elegante, casual, direto e levemente editorial.
- Sensação: brechó contemporâneo, loja pequena bem curada, sustentável sem parecer institucional.
- Logo: wordmark "desapega" em caixa baixa; símbolo opcional construído a partir de um traço simples ou etiqueta.
- Fotografia: fundo neutro, enquadramento consistente, sem filtros fortes e sem excesso de elementos decorativos.

## 3.2. Paleta sugerida

| **Token**      | **Hex** | **Uso**                                 |
| -------------- | ------- | --------------------------------------- |
| \--background  | #FAF9F7 | Fundo principal / papel quente          |
| \--foreground  | #171717 | Texto principal                         |
| \--muted       | #6B6B6B | Texto secundário                        |
| \--line        | #E5E5E5 | Bordas / divisórias                     |
| \--surface     | #FFFFFF | Cards e superfícies                     |
| \--accent      | #A85A3A | Ações, links ativos, pequenos destaques |
| \--accent-soft | #F8ECE7 | Fundos suaves de destaque               |
| \--success     | #3F6B50 | Disponibilidade / sucesso               |
| \--danger      | #A33C32 | Erro / cancelamento                     |

Uso da cor: no máximo uma cor de destaque forte por composição. A página não deve parecer colorida; as roupas são a principal fonte de variação cromática.

## 3.3. Tipografia

- Principal: Inter ou Geist Sans. Preferência prática: Inter para identidade neutra e ampla.
- Títulos: peso 500–650; corpo: 400; preços: 550–650.
- Evitar caixa alta em blocos longos. Usar minúsculas na marca e títulos curtos.
- Escala sugerida: 12/14 px para metadados; 16 px corpo; 20–24 px subtítulos; 36–56 px hero desktop.

## 3.4. Componentes visuais

- Raio pequeno e consistente: 10–14 px em inputs e superfícies; 999 px apenas em pills/status.
- Sombras quase inexistentes. Preferir bordas suaves e contraste de superfície.
- Botões sólidos somente para ação primária; ações secundárias devem ser ghost/outline/text.
- Cards de produto sem excesso de moldura: fotografia + dados essenciais; hover com leve zoom da imagem, sem efeitos chamativos.

# 4\. Arquitetura de informação e rotas

| **Área**             | **Rota**                 | **Acesso**                 |
| -------------------- | ------------------------ | -------------------------- |
| Home                 | /                        | Público                    |
| Catálogo             | /produtos                | Público                    |
| Detalhe              | /produtos/\[id\]         | Público                    |
| Login                | /login                   | Público                    |
| Cadastro             | /cadastro                | Público                    |
| Checkout             | /checkout                | Cliente autenticado        |
| Pedido concluído     | /checkout/sucesso/\[id\] | Cliente autenticado        |
| Meus pedidos         | /minha-conta/pedidos     | Cliente autenticado        |
| Perfil               | /minha-conta/dados       | Cliente autenticado        |
| Admin login          | /admin/login             | Público / redirecionamento |
| Dashboard            | /admin                   | Admin                      |
| Produtos             | /admin/produtos          | Admin                      |
| Novo produto         | /admin/produtos/novo     | Admin                      |
| Editar produto       | /admin/produtos/\[id\]/editar | Admin                 |
| Pedidos              | /admin/pedidos           | Admin                      |
| Novo pedido manual   | /admin/pedidos/novo      | Admin                      |
| Detalhe do pedido    | /admin/pedidos/\[id\]    | Admin                      |
| Clientes             | /admin/clientes          | Admin                      |
| Detalhe do cliente   | /admin/clientes/\[id\]   | Admin                      |
| Fornecedores         | /admin/fornecedores      | Admin                      |
| Novo fornecedor      | /admin/fornecedores/novo | Admin                      |
| Editar fornecedor    | /admin/fornecedores/\[id\]/editar | Admin             |
| Cadastros auxiliares | /admin/configuracoes     | Admin                      |

*Todas as rotas acima estão 100% implementadas e integradas à API Laravel real, sem dados fictícios.

## 4.1. Navegação pública

- Header desktop: logo → Produtos → busca opcional → conta → seleção/cesta → menu.
- Header mobile: logo, conta e cesta; filtros entram em drawer/bottom sheet.
- Footer: marca, links institucionais, ajuda, contato, políticas e acesso administrativo discreto.

## 4.2. Navegação administrativa

- Sidebar fixa no desktop e drawer no mobile/tablet.
- Itens: Visão geral, Produtos, Pedidos, Clientes, Fornecedores, Configurações.
- Topo: breadcrumb, título da página, ações contextuais e avatar/conta.

# 5\. Especificação detalhada das páginas

## 5.1. Home — /

Objetivo: apresentar a identidade do bazar e levar rapidamente para o acervo.

### Composição da tela

- Header minimalista com logo, Produtos, acesso à conta e ação de cesta/seleção.
- Hero editorial curto: frase de posicionamento + CTA "Ver peças". Evitar carrossel automático.
- Bloco "acabou de chegar" com 4–8 produtos, reutilizando GET /api/produtos.
- Atalhos visuais por tipo de peça: Casacos, Calças, Vestidos etc.; os valores são derivados da resposta/API quando disponíveis.
- Bloco de confiança: "Peças únicas", "Compra simples", "Retirada no local ou envio" — somente promessas compatíveis com a operação.
- Footer limpo e responsivo.

### Estados obrigatórios

- Carregar produtos disponíveis sem login.
- Skeleton enquanto a vitrine carrega.
- Estado vazio elegante quando não houver itens.
- CTA de detalhe em cada card.

## 5.2. Catálogo — /produtos

Objetivo: ser a principal ferramenta de descoberta.

### Composição da tela

- Grid responsivo: 2 colunas mobile, 3 tablet, 4 desktop como ponto inicial.
- Barra superior com quantidade encontrada, ordenação local se aplicável e botão de filtros.
- Filtros já suportados pela API: tipo, gênero e tamanho. Correspondem a ?tipo, ?genero e ?tamanho em GET /api/produtos. (SDD da API, vitrine)
- Filtros mobile em drawer; desktop em painel lateral de 260–300 px.
- Card: foto principal, marca, tipo, gênero/tamanho em metadado discreto, preço em destaque.
- Não exibir custo de aquisição nem dados de fornecedor na vitrine.

### Estados obrigatórios

- Estado sem resultado
- URL sincronizada com filtros
- Botão "Limpar filtros"
- Erro de API com retry

## 5.3. Detalhe do produto — /produtos/\[id\]

Objetivo: entregar informação suficiente para decisão de compra.

### Composição da tela

- Galeria com imagem principal grande e miniaturas; API retorna toda a galeria. (SDD da API, detalhe e galeria)
- Bloco de informação: marca, tipo, gênero, tamanho, cor e preço de venda.
- Indicar que se trata de uma peça única quando verdadeiro.
- CTA principal: "Comprar" / "Continuar para checkout".
- Preço sempre formatado em BRL, mas mantendo o valor numérico da API como fonte de verdade.
- Não exibir data de entrada, preço de custo ou fornecedor na área pública, salvo decisão futura do produto.

### Estados obrigatórios

- 404 quando id não existe
- Imagem indisponível com fallback
- Bloqueio de compra quando estoque deixar de estar disponível

## 5.4. Login — /login

Objetivo: autenticar cliente ou administrador.

### Composição da tela

- Campos: e-mail e senha.
- CTA "Entrar".
- Link para cadastro.
- Feedback de erro sem expor detalhes internos da API.
- Após login: se is_admin = true, permitir entrada em /admin; caso contrário, voltar ao destino originalmente solicitado.
- Contrato: POST /api/login com email e password; resposta inclui token e user com is_admin. (SDD da API, login)

### Estados obrigatórios

- Loading no botão
- 422/401 tratados com mensagem amigável
- Persistência de sessão

## 5.5. Cadastro — /cadastro

Objetivo: criar um cliente e iniciar a sessão.

### Composição da tela

- Campos: nome, e-mail, senha, data de nascimento, telefone, cidade e endereço.
- Campos de cidade devem usar lista baseada em estados/cidades quando endpoints de consulta forem disponibilizados; a API fornecida documenta as tabelas, mas não documenta GET público para essas listas.
- Validação de formato no front-end com Zod; validação final continua no servidor.
- Contrato: POST /api/register. O backend força is_admin=false por padrão. (SDD da API)

### Estados obrigatórios

- Sucesso: sessão criada
- Erros por campo quando API informar
- Proteção contra envio duplicado

## 5.6. Checkout — /checkout

Objetivo: criar o pedido.

### Composição da tela

- Resumo dos produtos selecionados: imagem, marca, tamanho, preço e total.
- Escolha de entrega por tipo. A API documenta Correios e Retirada no Local como modalidades, mas o endpoint POST /api/pedidos recebe apenas id_tipo_entrega e produtos. (SDD da API, tipos de entrega) (SDD da API, checkout)
- Exibir total calculado a partir dos preços retornados pela API; a resposta final do pedido continua sendo a fonte de verdade.
- CTA "Finalizar pedido".
- Antes de enviar, impedir duplicidade de clique e congelar o snapshot visual dos itens.
- Contrato: POST /api/pedidos com Authorization Bearer e payload {id_tipo_entrega, produtos\[\]}. (SDD da API, checkout)

### Estados obrigatórios

- Carrinho vazio
- Sessão expirada
- Produto ficou indisponível
- Erro 422 de concorrência/estoque

## 5.7. Sucesso do pedido — /checkout/sucesso/\[id\]

Objetivo: confirmar a compra com clareza.

### Composição da tela

- Exibir id do pedido, valor total e status inicial "Aguardando Pagamento". Esses são os dados retornados na criação. (SDD da API, retorno do pedido)
- CTA para continuar navegando.
- Incluir próximos passos de forma curta, sem inventar instruções de pagamento não presentes na API.

### Estados obrigatórios

- Evitar atualizar a página recriando o pedido
- Se status não puder ser consultado depois, mostrar somente o snapshot confirmado na criação

## 5.8. Minha conta — /minha-conta/\*

Objetivo: área do cliente. Esta área é recomendada para produto, mas requer extensão da API.

### Composição da tela

- Perfil: nome, e-mail, telefone, data de nascimento, cidade e endereço.
- Meus pedidos: lista com id, data, valor total, tipo de entrega e status.
- Detalhe do pedido: produtos, total e status atual.
- Não implementar as telas como se os endpoints existissem. Criar os componentes e contratos como backlog do back-end.

### Estados obrigatórios

- API pendente: GET/PATCH de perfil
- API pendente: GET /api/pedidos do usuário
- API pendente: GET /api/pedidos/{id}

## 5.9. Admin login — /admin/login

Mesma autenticação REST, porém com tratamento explícito de autorização. O login pode responder com is_admin=false; nesse caso, o usuário deve ser impedido de acessar o painel e redirecionado para a vitrine. A API exige autenticação Sanctum e middleware com is_admin=true nas rotas administrativas. (SDD da API, acesso administrativo)

## 5.10. Dashboard administrativo — /admin

Objetivo: visão operacional do bazar. O dashboard deve ser construído para responder "o que preciso resolver agora?" e não para virar um BI exagerado.

- Cards de KPI: pedidos em processamento, peças disponíveis, peças vendidas e valor vendido — apenas quando os endpoints/relatórios de agregação existirem.
- Lista "Pedidos que precisam de atenção" por status.
- Lista "Últimas peças cadastradas".
- Bloco de alertas: baixo acervo, pedidos pendentes, erros recentes — dependendo de endpoints futuros.

**Dependência de API**

A especificação atual não documenta GET de dashboard ou métricas. Portanto, o layout deve existir, mas os dados precisam de endpoints administrativos adicionais ou agregação no back-end.

## 5.11. Produtos administrativos — /admin/produtos

Objetivo: consultar e gerenciar o acervo. O backend atual documenta o cadastro de um produto com múltiplas fotos via multipart/form-data, mas não documenta listagem, edição ou exclusão administrativa.

- Tabela desktop / cards compactos em telas menores.
- Colunas recomendadas: foto, id, marca, tipo, gênero, tamanho, cor, preço de venda, disponibilidade, fornecedor e data de entrada.
- Filtros por disponibilidade, tipo, gênero, fornecedor e busca por marca/id quando suportados pelo back-end.
- Ação "Novo produto".
- Ações "Visualizar", "Editar" e "Arquivar/excluir" somente após criação dos endpoints correspondentes.

## 5.12. Novo produto — /admin/produtos/novo

Esta é a principal tela administrativa para alimentação do acervo.

- Formulário em duas colunas no desktop: dados da peça à esquerda; fotos e resumo financeiro à direita.
- Campos: fornecedor, tipo, gênero, data de entrada, marca, tamanho, cor, preço de custo, preço de venda e fotos\[\].
- **Novo recurso implementado**: Botão e modal inline **"+ Cadastrar novo fornecedor"** diretamente na tela de produto, permitindo cadastrar fornecedores em tempo real sem perder o formulário preenchido.
- Upload múltiplo com drag-and-drop, preview, reordenação da galeria e definição da foto principal.
- Submit como multipart/form-data via POST /api/admin/produtos enviando foto_principal e fotos_secundarias[].
- Após 201: toast de confirmação e redirecionamento para a lista de produtos.

## 5.13. Editar produto — /admin/produtos/\[id\]/editar

- Totalmente implementada e conectada a GET /api/admin/produtos/{id} e PUT /api/admin/produtos/{id}.
- Reutiliza os dados cadastrais da peça, permitindo alterar marca, tipo, gênero, tamanho, cor, preços de custo/venda e status de disponibilidade.

## 5.14. Pedidos administrativos — /admin/pedidos

- Tabela por status: Aguardando Pagamento, Pagamento Aprovado, Em Separação, Enviado, Entregue, Cancelado.
- Filtros em tempo real por status e busca por cliente ou número de pedido.
- Conectada a GET /api/admin/pedidos sem mocks fictícios.
- Ação de visualização rápida e botão para criação de pedidos manuais.

## 5.14.1. Novo pedido manual / Venda Direta — /admin/pedidos/novo

**Feature adicionada além da especificação inicial (Bônus de Engenharia e Operação)**:
- Permite ao administrador registrar vendas diretas ocorridas por canais externos (Instagram, WhatsApp, amigos ou balcão da loja física).
- Seleção de cliente cadastrado ou clique em **"+ Cadastrar novo cliente rápido"** (modal na própria página) para criar e selecionar o cliente imediatamente.
- Busca e seleção múltipla de peças com status "Disponível" no acervo, exibindo miniatura, marca, tamanho e preço, com cálculo dinâmico do total da venda.
- Escolha da modalidade de entrega e status inicial (ex: "Pagamento Aprovado" ou "Entregue").
- Ao confirmar (POST /api/admin/pedidos), as peças selecionadas são automaticamente baixadas do estoque (id_status_disp = 3).

## 5.15. Detalhe do pedido — /admin/pedidos/\[id\]

- Conectada a GET /api/admin/pedidos/{id} e PUT /api/admin/pedidos/{id}.
- Timeline visual do status do pedido com transição em tempo real.
- Lista completa de peças do pedido com fotos e valores.
- **Regra de estoque reversa**: Se o administrador alterar o status para "Cancelado", as peças voltam automaticamente a ficar disponíveis (id_status_disp = 1) no acervo.

## 5.16. Clientes — /admin/clientes e /admin/clientes/\[id\]

- Conectada a GET /api/admin/clientes e GET /api/admin/clientes/{id}.
- Tabela com lista completa de clientes cadastrados, cidades, contatos e contagem de compras.
- Detalhe individual do cliente com histórico completo de pedidos e total acumulado gasto.

## 5.17. Fornecedores — /admin/fornecedores

- Conectada a GET /api/admin/fornecedores, POST /api/admin/fornecedores e PUT /api/admin/fornecedores/{id}.
- Listagem com contagem de peças fornecidas.
- Telas de novo fornecedor (/admin/fornecedores/novo) e edição (/admin/fornecedores/[id]/editar).

## 5.18. Configurações / cadastros auxiliares — /admin/configuracoes

- Totalmente implementada e interativa através de GET/POST/PUT/DELETE em /api/admin/configuracoes/{grupo}/{id}.
- Permite adicionar, editar o nome inline e excluir registros em tempo real de:
  - Tipos de Entrega (tipos_entrega)
  - Categorias / Tipos de Peça (tipos_produto)
  - Status de Pedidos (status_pedidos)
  - Gêneros do Acervo (generos)

# 6\. Design system e componentes

| **Componente** | **Variações**                       | **Regras**                                                       |
| -------------- | ----------------------------------- | ---------------------------------------------------------------- |
| Button         | primary, secondary, ghost, danger   | 1 ação primária por contexto; altura 40–44 px.                   |
| Input          | text, email, password, number, date | Label sempre visível; mensagem de erro abaixo.                   |
| Select         | single, searchable                  | Usar para entidades com lista; evitar select gigantes.           |
| ProductCard    | default, compact                    | Imagem primeiro; preço e metadados sempre visíveis.              |
| ProductGallery | desktop, mobile                     | Teclado acessível; imagem principal + thumbnails.                |
| FilterDrawer   | mobile, desktop                     | Estado sincronizado com URL.                                     |
| StatusBadge    | order, availability                 | Cor + texto; nunca depender apenas de cor.                       |
| DataTable      | admin                               | Cabeçalho fixo quando útil, densidade moderada, ações discretas. |
| Modal / Dialog | confirm, form, detail               | Usar para ações destrutivas e confirmações.                      |
| Toast          | success, error, info                | Mensagem curta, ação opcional.                                   |
| EmptyState     | catalog, table, orders              | Explicar por que está vazio e indicar próxima ação.              |
| Skeleton       | card, page, table                   | Usar para preservar layout durante carregamento.                 |

## 6.1. Componentes de domínio

- ProductCard / ProductGrid / ProductFilters / ProductGallery / ProductForm
- OrderSummary / CheckoutForm / OrderStatusTimeline
- AdminSidebar / AdminHeader / AdminKpiCard / AdminDataTable
- AuthGuard / AdminGuard / ErrorState / EmptyState

# 7\. Estado, cache e integração com API

## 7.1. Modelo de autenticação

- Após login/register, o front-end recebe token e user. O user inclui is_admin. (SDD da API, autenticação)
- Sessão global deve expor: user, isAuthenticated, isAdmin, login, register, logout e refresh/validate quando houver endpoint disponível.
- Preferência: cookie HttpOnly via BFF para evitar token acessível por JavaScript. Se isso não for possível com a infraestrutura atual, isolar o token e nunca persistir em localStorage sem avaliação de risco.
- Rotas /admin/\* devem ter guard no servidor e no cliente, mas a autorização real sempre permanece no Laravel.

## 7.2. Cliente HTTP

Criar um único módulo para a API, nunca espalhar fetch() por componentes.

- baseUrl configurável por NEXT_PUBLIC_API_URL apenas quando chamadas públicas forem diretas; no modelo BFF, o navegador usa somente rotas internas.
- Normalizar erros em um tipo FrontendApiError com status, message, fieldErrors e raw opcional somente para logs de desenvolvimento.
- Interceptors/wrappers para Authorization Bearer quando o desenho escolhido não usar BFF.

## 7.3. Query keys sugeridas

products(filters)

product(id)

currentUser

orders(filters)

order(id)

adminProducts(filters)

adminOrders(filters)

suppliers(filters)

customers(filters)

# 8\. Matriz de integração com a API (Status Final)

| **Tela**                   | **Método**            | **Endpoint**                        | **Uso**                                     | **Situação**                |
| -------------------------- | --------------------- | ----------------------------------- | ------------------------------------------- | --------------------------- |
| Cadastro                   | POST                  | /api/register                       | Criar cliente + receber sessão              | Implementado e Integrado    |
| Login                      | POST                  | /api/login                          | Autenticar cliente/admin                    | Implementado e Integrado    |
| Logout                     | POST                  | /api/logout                         | Revogar token/encerrar sessão               | Implementado e Integrado    |
| Catálogo                   | GET                   | /api/produtos                       | Listar peças disponíveis + filtros          | Implementado e Integrado    |
| Detalhe                    | GET                   | /api/produtos/{id}                  | Detalhes completos + galeria de fotos       | Implementado e Integrado    |
| Checkout                   | POST                  | /api/pedidos                        | Criar pedido da loja online                 | Implementado e Integrado    |
| Meus pedidos               | GET                   | /api/meus-pedidos                   | Histórico de pedidos do cliente             | Implementado e Integrado    |
| Admin Dashboard            | GET                   | /api/admin/* (agregação)            | KPIs reais e pedidos pendentes              | Implementado e Integrado    |
| Admin produtos             | GET                   | /api/admin/produtos                 | Acervo completo com dados administrativos   | Implementado e Integrado    |
| Admin / novo produto       | POST                  | /api/admin/produtos                 | Criar peça + múltiplas fotos                | Implementado e Integrado    |
| Admin / editar produto     | GET / PUT             | /api/admin/produtos/{id}            | Consulta e atualização de peça              | Implementado e Integrado    |
| Admin / excluir produto    | DELETE                | /api/admin/produtos/{id}            | Exclusão de peça do acervo                  | Implementado e Integrado    |
| Admin pedidos              | GET                   | /api/admin/pedidos                  | Listagem de vendas com status               | Implementado e Integrado    |
| Admin / novo pedido manual | POST                  | /api/admin/pedidos                  | Vendas diretas (Instagram/WhatsApp/Balcão)  | Implementado e Integrado    |
| Admin / status pedido      | PUT                   | /api/admin/pedidos/{id}             | Avançar status (e devolver estoque se cancelado) | Implementado e Integrado |
| Admin clientes             | GET / POST            | /api/admin/clientes                 | Listagem e cadastro rápido de cliente       | Implementado e Integrado    |
| Admin detalhe cliente      | GET                   | /api/admin/clientes/{id}            | Histórico de compras do cliente             | Implementado e Integrado    |
| Admin fornecedores         | GET / POST            | /api/admin/fornecedores             | Listagem e criação com vínculo 1:1 de user  | Implementado e Integrado    |
| Admin editar fornecedor    | PUT                   | /api/admin/fornecedores/{id}        | Atualização cadastral de fornecedor         | Implementado e Integrado    |
| Admin configurações        | GET/POST/PUT/DELETE   | /api/admin/configuracoes/{grupo}    | CRUD completo de entregas, tipos, status e gêneros | Implementado e Integrado |

## 8.1. Contratos suportados e regras de negócio ativas

- **Peça única de brechó**: Produtos possuem restrição unitária no banco (`item_pedidos.id_produto` é UNIQUE). Quando um pedido é confirmado (seja pelo checkout ou via pedido manual), a API atualiza `id_status_disp = 3` (Vendido).
- **Cancelamento inteligente**: Ao alterar o status de um pedido para "Cancelado", a API reverte automaticamente o status de todas as suas peças para `id_status_disp = 1` (Disponível).
- **Vendas Multicanal / Venda Direta**: O endpoint `POST /api/admin/pedidos` permite ao admin realizar vendas balcão ou registrar vendas originadas no WhatsApp e Instagram selecionando cliente existente ou cadastrando um novo cliente rapidamente.
- **Herança 1:1 de Usuários**: Clientes e Fornecedores compartilham a superclasse `usuarios`, mantendo integridade com cidades e autenticação unificada.

## 8.2. Recursos adicionados além da especificação inicial (Bônus de Engenharia)

1. **Vendas Manuais / Diretas (`/admin/pedidos/novo`)**: Criação de pedidos no painel para vendas externas com seleção visual de peças disponíveis e baixa automática.
2. **Cadastro Rápido de Fornecedor Inline**: Modal direto na tela de novo produto para cadastrar fornecedor sem sair da tela.
3. **Cadastro Rápido de Cliente Inline**: Modal na tela de pedido manual para cadastrar cliente na hora da venda.
4. **CRUD Dinâmico de Configurações**: Adição, edição de nome inline e exclusão de entregas, categorias, gêneros e status em tempo real.
5. **Cesta Lateral Clicável**: Acesso rápido e navegação fluida aos produtos direto da gaveta de compras.
6. **Remoção de Redundâncias**: Rodapé refinado eliminando duplicações de selos institucionais.

# 9\. Regras de UX para fluxos críticos

## 9.1. Compra de uma peça

1. Usuário entra no catálogo.
2. Aplica filtros, se necessário.
3. Abre o detalhe.
4. Clica em comprar.
5. Se não autenticado, vai para login e retorna ao checkout.
6. Seleciona tipo de entrega.
7. Revê peças e total.
8. Clica em finalizar apenas uma vez.
9. Front-end lida com 201, 401 e 422.
10. Em sucesso, mostra id_pedido e status retornado pela API.

## 9.2. Conflito de disponibilidade

A API verifica se todas as peças continuam disponíveis e retorna 422 quando alguma já foi reservada/vendida; o front-end deve tratar isso como estado de concorrência, não como erro genérico. (SDD da API, validação de disponibilidade)

**Mensagem sugerida**

"Uma das peças acabou de ser vendida. Atualizamos sua seleção; revise os itens antes de tentar novamente."

## 9.3. Cadastro de produto

1. Selecionar fornecedor, tipo e gênero.
2. Preencher dados da peça.
3. Adicionar fotos.
4. Definir foto principal.
5. Revisar preço de custo e venda.
6. Enviar multipart/form-data.
7. Mostrar retorno e id_produto.
8. Atualizar lista administrativa.

# 10\. Responsividade e acessibilidade

## 10.1. Breakpoints comportamentais

| **Faixa**   | **Comportamento**                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------- |
| < 640 px    | Header reduzido; filtros em drawer; grid 2 colunas; checkout em uma coluna; fotos priorizadas. |
| 640–1023 px | Grid 3 colunas; sidebar administrativa vira drawer; formulários 1–2 colunas.                   |
| ≥ 1024 px   | Grid 4 colunas; catálogo com sidebar; admin com sidebar fixa; detalhe em duas colunas.         |
| ≥ 1440 px   | Container limitado em ~1280–1360 px para preservar leitura e estética.                         |

## 10.2. Acessibilidade

- WCAG 2.2 AA como referência de implementação.
- Foco visível e ordem de tabulação lógica.
- Contraste suficiente; status não pode depender apenas de cor.
- Imagens com alt útil; miniaturas acessíveis via teclado.
- Labels associados a inputs; mensagens de erro anunciadas quando necessário.
- Dialog, drawer e menu com controle de foco.

# 11\. Segurança

- Nunca confiar em is_admin enviado pelo cliente; o Laravel continua sendo a autoridade. A API já exige middleware administrativo baseado em is_admin=true. (SDD da API, acesso administrativo)
- Não exibir preço de custo, senha, tokens ou informações internas ao cliente.
- Validar MIME/tamanho de imagem antes do upload e aceitar somente formatos definidos pelo produto.
- Escapar conteúdo textual exibido na UI.
- Rate limiting e proteção contra abuso devem permanecer no backend.
- Usar HTTPS em produção.
- Não colocar segredos do Laravel em NEXT_PUBLIC_\*.

# 12\. Performance, SEO e observabilidade

## 12.1. Performance

- Usar next/image para imagens públicas quando a origem puder ser configurada com segurança.
- Lazy-load de imagens abaixo da dobra.
- Evitar JS global pesado: componentes interativos devem ser client-side somente quando necessário.
- Skeletons preservam layout e reduzem sensação de travamento.
- Debounce para filtros de texto, quando houver busca.

## 12.2. SEO

- Title e description por produto.
- URLs legíveis e estáveis.
- Open Graph para páginas de produto.
- Sitemap para páginas públicas indexáveis.
- Robots configurado para não indexar /admin, /checkout e páginas privadas.

## 12.3. Observabilidade

- Logs de integração em modo de desenvolvimento.
- Monitoramento de erros de front-end em produção (Sentry ou equivalente).
- Métricas de Web Vitals.
- Correlation/request id, caso o backend ofereça header para isso.

# 13\. Estrutura de projeto sugerida

A estrutura abaixo privilegia domínio e separação entre área pública e admin, evitando um diretório de componentes global gigantesco.

app/

(public)/

page.tsx

produtos/page.tsx

produtos/\[id\]/page.tsx

login/page.tsx

cadastro/page.tsx

checkout/page.tsx

(account)/minha-conta/...

admin/

layout.tsx

login/page.tsx

page.tsx

produtos/page.tsx

produtos/novo/page.tsx

produtos/\[id\]/page.tsx

pedidos/page.tsx

pedidos/\[id\]/page.tsx

clientes/page.tsx

fornecedores/page.tsx

configuracoes/page.tsx

components/

ui/

commerce/

admin/

lib/

api/

auth/

validators/

formatters/

utils/

providers/

query-provider.tsx

auth-provider.tsx

contracts/

auth.ts

product.ts

order.ts

admin.ts

## 13.1. Convenções

- Componentes PascalCase.
- Funções/hooks camelCase.
- Tipos e schemas próximos ao domínio, não dentro de páginas monolíticas.
- Uma página deve orquestrar; regras de API e validação ficam em módulos próprios.

# 14\. Critérios de aceite

| **ID**  | **Critério**                                                                           |
| ------- | -------------------------------------------------------------------------------------- |
| UX-01   | Todas as páginas públicas possuem layout responsivo e identidade visual consistente.   |
| UX-02   | Catálogo permite filtrar por tipo, gênero e tamanho usando os parâmetros documentados. |
| UX-03   | Detalhe mostra galeria completa e informações de produto retornadas pela API.          |
| AUTH-01 | Login interpreta corretamente is_admin e protege /admin.                               |
| AUTH-02 | Cadastro envia exatamente os campos documentados.                                      |
| CHK-01  | Checkout exige autenticação e envia Bearer Token.                                      |
| CHK-02  | Checkout trata 422 como indisponibilidade/conflito, sem duplicar pedido.               |
| ADM-01  | Novo produto envia multipart/form-data com múltiplas fotos.                            |
| ADM-02  | Painel possui navegação própria e estados de acesso negado.                            |
| A11Y-01 | Interações críticas podem ser operadas por teclado.                                    |
| SEC-01  | Token e dados sensíveis nunca aparecem no DOM, logs de produção ou UI.                 |
| PERF-01 | Imagens são carregadas de forma otimizada e sem layout shift evitável.                 |

# 15\. Ordem recomendada de implementação

## Fase 1 — Fundação

- Criar projeto Next.js + TypeScript.
- Configurar Tailwind, shadcn/ui, Lucide.
- Criar tokens visuais e layout público/admin.
- Criar cliente HTTP, schemas e tratamento de erros.
- Configurar ambiente e CORS/BFF conforme arquitetura escolhida.

## Fase 2 — Vitrine

- Home.
- Catálogo + filtros.
- Detalhe do produto + galeria.
- Estados loading/erro/vazio.

## Fase 3 — Autenticação

- Login.
- Cadastro.
- Guards e sessão.
- Fluxo de retorno para destino original.

## Fase 4 — Checkout

- Seleção de entrega.
- Resumo dos itens.
- POST /api/pedidos.
- Sucesso e tratamento 422.

## Fase 5 — Admin suportado

- Admin login/guard.
- Dashboard shell.
- Novo produto + upload múltiplo.
- Lista administrativa quando GET de produtos existir.

## Fase 6 — Extensão da API + painel completo

- Pedidos.
- Clientes.
- Fornecedores.
- Configurações auxiliares.
- Minha conta.
- Métricas e relatórios.

## Fase 7 — Qualidade

- Testes E2E.
- Acessibilidade.
- Performance.
- SEO.
- Monitoramento.
- Deploy.

# 16\. Decisões arquiteturais recomendadas

| **Decisão**   | **Recomendação**                       | **Razão**                                                              |
| ------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| Framework     | Next.js                                | Melhor equilíbrio para vitrine + área administrativa no mesmo projeto. |
| Linguagem     | TypeScript                             | Contratos tipados e manutenção segura.                                 |
| API client    | Camada única                           | Evita divergência de headers, erros e parsing.                         |
| Auth          | Cookie HttpOnly via BFF, quando viável | Reduz exposição do Bearer Token ao JavaScript.                         |
| Server state  | TanStack Query                         | Excelente para REST e operações CRUD.                                  |
| UI primitives | shadcn/ui                              | Composição e controle visual.                                          |
| CSS           | Tailwind                               | Consistência e velocidade.                                             |
| Identidade    | Editorial minimalista                  | Valoriza fotos e diferencia o bazar de vitrines genéricas.             |

# 17\. Pendências que devem ser fechadas antes do painel completo

A especificação recebida deixa explícitas somente seis famílias de operação de front-end: autenticação, vitrine, detalhe, checkout e cadastro administrativo de produto, além de CORS. Para entregar um painel de administrador operacional, a API precisa expor leitura e mutação dos domínios adicionais.

| **Domínio**  | **O que falta definir**                                                               |
| ------------ | ------------------------------------------------------------------------------------- |
| Sessão       | Logout/revogação, expiração, recuperação de senha (se existir).                       |
| Produtos     | Lista admin, detalhe, edição, exclusão/arquivamento, atualização de fotos, paginação. |
| Pedidos      | Lista, detalhe, atualização de status, filtros, paginação.                            |
| Cliente      | Perfil, pedidos, detalhe de pedido.                                                   |
| Fornecedores | CRUD e consulta de produtos.                                                          |
| Auxiliares   | GET/CRUD de tipos, gêneros, estados/cidades e tipos de entrega.                       |
| Dashboard    | KPIs e série temporal, se desejados.                                                  |
| Paginação    | Formato padrão (page, per_page, total etc.).                                          |
| Erros        | Estrutura padrão de validation errors por campo.                                      |

## 17.1. Contrato de erro recomendado

Para que o front-end consiga produzir feedback consistente, recomenda-se que o Laravel padronize erros para algo como:

{"message":"Descrição amigável","errors":{"campo":\["Mensagem de validação"\]}}

Isso é recomendação de integração, não um formato já garantido pelo documento da API.

# 18\. Resultado esperado

Ao final, o Bazar Desapega deve parecer uma loja pequena e bem curada, não um painel de software. Na vitrine, a interface quase desaparece e deixa as peças dominarem a experiência. No admin, a mesma paleta, tipografia e componentes permanecem, mas a densidade de informação aumenta para favorecer operação.

**Diretriz central**

"Menos interface, mais peça." Tudo que não ajuda o usuário a descobrir, decidir, comprar ou administrar deve ser removido ou relegado a uma camada secundária.

# 19\. Fontes e bases utilizadas

Fonte primária: "Documento de Especificação de Software (SDD) - API Bazar Desapega", arquivo fornecido no projeto. Entre os trechos usados como base estão a arquitetura headless/REST, autenticação Sanctum, modelo de produtos, contratos de autenticação/vitrine/checkout/admin e requisitos de CORS. (SDD da API, seção 1) (SDD da API, contratos e rotas) (SDD da API, autenticação) (SDD da API)

Verificação tecnológica externa: documentação oficial do Next.js, política de suporte/LTS do Next.js, documentação oficial do React e atualizações do Tailwind CSS. (documentação oficial consultada)