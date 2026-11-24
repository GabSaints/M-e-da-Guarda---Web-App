# Pendências para começar a vender

1. Definir provedor de autenticação, checkout, banco e hospedagem com o dono.
2. Implementar backend com autorização, acesso protegido e direito de acesso por compra verificada. Não hospedar conteúdo pago publicamente.
3. Conectar webhooks com assinatura, idempotência e reembolso/revogação.
4. Definir se progresso permanece local ou sincroniza; implementar somente ids de atividades, com consentimento/privacidade adequados à operação.
5. Configurar SAC com e-mail real ou API implementada, equipe, prazo e fluxo de reembolso. O código não cria essa operação.
6. Fornecer vendedor, contato, domínio, termos, privacidade e política comercial revisados para a operação.
7. Revisar o conteúdo educativo com profissional qualificado e definir público/faixa etária aplicável.
8. Testar compra, entrega, acesso negado, restauração, isolamento entre usuários, reembolso e revogação com o provedor real.
9. Somente depois confirmar os flags de config da página e publicar com autorização do dono.

O restante não é só “ajustar o banco”: envolve servidor, acesso e operação. A entrega atual conclui o frontend e o conteúdo local; integrações reais permanecem pendentes.
