# Mãe da Guarda | entrega para mentorado

Oferta: R$ 19,90, pagamento único. Público: mães e responsáveis que querem apoiar a criança na convivência escolar. Promessa: observar, conversar e combinar apoio. Não garantir popularidade, amizades, fim de bullying ou resultado clínico.

Este pacote tem frontend e conteúdo implementados. NÃO possui autenticação real, verificação de pagamento, banco de dados ou implantação de produção. Não é suficiente conectar uma tabela: o mentorado precisa implementar o servidor, proteção de acesso, permissões, checkout e atendimento conforme o pacote.

Extraia os três ZIPs dentro da mesma pasta, mantendo as pastas irmãs `pagina-vendas`, `entregavel-webapp` e `sac`. Sirva essa pasta pai com `python3 -m http.server 4185 --bind 127.0.0.1`. Abra a rota correspondente. Não abra por file://. Cada pasta também pode ser hospedada separadamente após ajustar seus links públicos.

Sem dependências de build. HTML/CSS/JS editáveis e fontes locais. Não há chaves, dados reais de clientes ou dependências de desenvolvimento nos ZIPs. Os modos locais não comprovam compra nem concedem acesso de produção. Não publicar o conteúdo pago como arquivos públicos.

## O que funciona

- Roteiro em três etapas, quatro situações, possibilidade de voltar e reiniciar.
- Rota de agressão/ameaça com proteção visível desde a seleção, sem esperar concluir etapas.
- Pergunta contextual, alternativa para pausa, ação de hoje e continuidade.
- Plano em TXT e impressão.
- Sete atividades completas com contexto, ação, exemplo, reflexão opcional e conclusão reversível.
- Navegação por hash, página desconhecida, controle de progresso, exportação JSON e exclusão.
- Progresso em memória por padrão; localStorage somente após opção explícita. Só números de atividades e preferência de salvamento são persistidos. Reflexões e situação escolhida NÃO são persistidas ou exportadas com o progresso.
- Plano exportado/imprimível inclui a situação selecionada e exige cuidado no compartilhamento.

## Rodar e editar

Abra `/entregavel-webapp/`. Conteúdo em `content.js`; interface em `app.js`; adaptação de persistência em `progress.js`; links e modo em `config.js`. O modo `production` hoje bloqueia a interface: é uma trava de prevenção, NÃO autenticação. Os arquivos continuam legíveis se publicados estaticamente; o mentorado precisa de proteção real no servidor/CDN antes de liberar o conteúdo pago.

Os sete dias são uma estrutura flexível, sem desbloqueio obrigatório, notificações, ranking ou avaliação da criança. O app não contém chat clínico, diagnóstico ou acompanhamento humano.

## Implantação deste repositório

A raiz configurada na Vercel é `entregavel-webapp`. A publicação atual é uma demonstração pública autorizada pelo proprietário, com ajuda interna em `#ajuda`. Não inclui SAC conectado nem venda. O progresso é opcional e restrito ao navegador. Para testar isoladamente, sirva esta pasta por HTTP e abra `/`.
