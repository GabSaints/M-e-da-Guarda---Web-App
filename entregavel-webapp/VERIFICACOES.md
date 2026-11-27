# Verificações — revisão de 27/11/2026

node verify.cjs: 300 verificações com DOM simulado passaram. Incluem 21 combinações (sete situações × três idades), pergunta distinta por idade, validação de seleção, reconhecimento de leitura, abertura/copiar, orientação de continuidade, TXT, impressão e limpeza após imprimir; ferramentas e marcações; migração sem perda das marcações antigas; aliases de links; corrupção e falha de armazenamento; exportação sem faixa etária/situação/reflexões; link do SAC e existência dos arquivos locais.

JavaScript validado com node --check. Estes testes não comprovam renderização visual, atendimento profissional ou segurança de serviços externos. Revisão no navegador da implantação deve complementar os testes.

Acesso, checkout e SAC externos não foram alterados nem certificados. As orientações continuam educativas e não substituem revisão profissional brasileira.

## Revisão da implantação no navegador

Interface conferida em desktop (1440×1000) e celular (390×844), sem overflow horizontal observado. Exercitados caso de silêncio para 4–6 anos, medo para 11+, vergonha para 7–10, troca de faixa/situação, cópia, seleção pela biblioteca e aviso imediato ao selecionar ameaça. Navegação por situações, ferramentas, recursos, marcações, segurança e ajuda conferida.

O comando de impressão abriu diálogo que bloqueou o controle automático da aba. O conteúdo da impressão e sua limpeza foram validados nos testes de lógica, mas a prévia visual de impressão não foi validada automaticamente. Nenhuma impressão física foi enviada.
