# Verificações desta integração — 23/11/2026

`node verify.cjs`: 58 verificações passaram em ambiente Node com DOM simulado: quatro caminhos do roteiro, validação de leitura, sete atividades, plano de impressão, consentimento para armazenamento, restauração, exclusão, registro corrompido, páginas auxiliares e existência dos arquivos referenciados. JavaScript validado com `node --check`.

Limites: estes testes não são testes de renderização do navegador. A prévia local não ficou acessível no navegador integrado e a revisão visual Windows foi interrompida porque a ferramenta não pôde confirmar a URL ativa com segurança. Celular, desktop e diálogo de impressão ainda precisam de revisão visual manual.

Sem validação de autenticação, checkout, backend ou suporte real: essas integrações não existem nesta versão demonstrativa.
