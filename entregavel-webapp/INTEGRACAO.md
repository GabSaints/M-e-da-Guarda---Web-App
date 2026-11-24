# Contrato de integração e responsabilidades

## Modelo mínimo de dados (referência, não migração executável)

- adult_accounts: id do provedor de autenticação, e-mail do adulto, criação.
- orders: id interno, usuário adulto, id externo único, provedor, estado, moeda, preço validado no servidor, timestamps.
- entitlements: usuário, produto, pedido, estado pending/active/refunded/revoked. Acesso deriva de evento verificado no servidor.
- webhook_events: provedor + event_id únicos, processamento e resultado. Validar assinatura e implementar idempotência, eventos fora de ordem e tentativas.
- progress: usuário autenticado, versão de conteúdo, ids de atividades concluídas, updated_at. Restrição de unicidade por usuário/produto. Não armazenar escolhas de situação, reflexões ou relatos infantis.
- support_tickets: id do servidor, conta do adulto quando houver, contato, categoria, referência de pedido, status, texto mínimo necessário, timestamps. Idempotência vinculada ao remetente/conta e hash do conteúdo. Não permitir consulta de tickets de terceiros apenas sabendo um id.

Separar identidade, compra, direito de acesso, progresso e atendimento. Não conceder acesso por conhecer o e-mail de compra nem por flag, querystring, localStorage ou frontend. Não incluir credenciais privadas no navegador.

## Backend e publicação

Escolher provedores com o dono. Implementar autenticação, autorização por usuário, rate limit, validação de entrada, política de retenção, exportação/exclusão e logs sem texto íntimo. Proteger páginas, APIs E os arquivos que contêm conteúdo pago. A trava no config.js não é controle de acesso.

Testar compra aprovada, pendente, falha, webhook repetido/fora de ordem, reembolso, revogação, sessões expiradas e tentativa de acesso cruzado entre usuários. Um reembolso/revogação deve impedir nova leitura do conteúdo pago no servidor, respeitando a política de atendimento definida.

## SAC: contrato executado pelo adaptador frontend

Modo API exige a mesma origem. Para provedores externos, implementar proxy/BFF seguro. Não afrouxar CORS nem expor chave de serviço para contornar o contrato.

GET /api/csrf -> 200 {"csrfToken":"token-de-sessao"}. Emitir token vinculado a sessão/cookie seguro, validar Origin e CSRF no POST; no-store.

POST /api/support/tickets
Headers: Content-Type application/json; X-CSRF-Token; Idempotency-Key; credentials same-origin.
Body: {category,name,email,orderReference,message}.
Limites do frontend: nome 80, e-mail 160, pedido 100, mensagem 10..1800. Servidor deve validar novamente, sanitizar para renderização e aceitar apenas categorias previstas. Exigir e-mail válido em modo API. Evitar logs do corpo. Cookies e autenticação conforme política real do canal.
Sucesso 200/201: {"ticket":{"id":"referencia-real"}} apenas depois de persistir com sucesso. Não devolver id fictício antes de salvar. Repetir mesma chave e mesmo conteúdo retorna o mesmo ticket; mesma chave com conteúdo diferente exige erro de conflito. A chave deve ser isolada por remetente/sessão e expirar conforme política definida.
Erros: 400/422 validação; 401/403 sessão/permissão; 409 conflito; 429 limite; 5xx indisponibilidade. O frontend não considera sucesso uma resposta sem ticket.id válido e não inventa protocolo.
Timeout 15s: tentativa posterior com mesma mensagem usa mesma chave, evitando duplicação. Alterar os campos gera nova chave. Retenção/limpeza das chaves e deduplicação devem existir no backend.

Painel do atendente, leitura/histórico, e-mails transacionais, status do ticket e notificações NÃO estão implementados neste frontend. Se necessários, construir com autorização por função e sem dados de crianças. A integração básica de criação de ticket não equivale a uma operação completa de suporte.

## Conteúdo e revisão

Conteúdo educativo autoral. Conferir adequação ao público/faixa etária que o vendedor definir e obter revisão de profissional qualificado antes da publicação comercial. Não apresentar o guia como tratamento ou diagnóstico. Em risco, encaminhar a apoio adequado sem funil de venda.
