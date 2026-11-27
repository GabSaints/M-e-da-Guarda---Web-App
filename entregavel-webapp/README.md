# Mãe da Guarda — guia para as conversas difíceis

Aplicativo educativo para mães, pais e responsáveis. A proposta é consultar uma situação, adaptar a linguagem à faixa etária e pensar em como acompanhar. Não há sequência diária, prazo para a criança se abrir, diagnóstico ou promessa de amizade, popularidade ou resultado clínico.

## Conteúdo e navegação

- Meu guia: situação + faixa etária (4–6, 7–10 ou 11 anos ou mais), abertura, resposta a evitar, próximos apoios, TXT e impressão.
- Situações: silêncio/“normal”, mais tempo sozinho, exclusão/rejeição, medo, vergonha, sensação de desamparo e ameaça/agressão/falta de proteção. São cenas ilustrativas, não casos reais.
- Ferramentas de conversa: sete práticas independentes, consultáveis em qualquer ordem. Marcar uso é opcional e não mede a criança.
- Frases e recursos: convite, reparação de resposta apressada, pausa e modelo para a escola.
- Proteção: apoio profissional e serviços adequados sem oferta comercial.
- Ajuda: direcionamento para https://sac.maedaguarda.com.br/.

## Privacidade e compatibilidade

Sem campos de nome, escola, foto ou relato íntimo. Faixa etária, situação e reflexões ficam na memória da página; não são salvas nem exportadas com as marcações. TXT e impressão das orientações incluem faixa etária e situação: há aviso para guardar e compartilhar com cuidado.

O salvamento local é opcional, apenas dos identificadores das ferramentas usadas e da preferência de salvamento. A chave anterior foi preservada para manter as marcações existentes. Links antigos #roteiro, #trilha e #dia-1 a #dia-7 continuam funcionando com a nova apresentação.

## Desenvolvimento e implantação

HTML/CSS/JS sem build. Arquivos: index.html, app.css, app.js, content.js, config.js e progress.js. Fontes locais com licença OFL. Sirva esta pasta por HTTP. Verificação funcional: node verify.cjs (DOM simulado); revisão visual separada.

A raiz do projeto Vercel é entregavel-webapp. Destino autorizado: https://app.maedaguarda.com.br/. O proprietário gerencia os acessos em serviço externo; esta atualização não implementa nem certifica autenticação, compra ou atendimento externo. Não incluir segredos no frontend. Revisões profissional e jurídica continuam necessárias conforme os documentos de integração.
