(() => {
  'use strict';

  let situation = null;
  const names = ['OBSERVAR', 'CONVERSAR', 'AGIR'];
  const scenarios = {
    unclear: {
      label: 'Você ainda tem poucas informações.',
      intro: 'Comece pela curiosidade, sem supor que a mudança tenha uma única causa.',
      script: 'Tenho percebido você um pouco diferente depois da escola. Como têm sido seus dias por lá?',
      follow: 'Se ele quiser continuar: “Tem algum momento da escola que tem sido bom ou difícil para você?”',
      title: 'Abra uma conversa e continue observando',
      body: 'Você ainda tem poucas informações. Escute o que a criança deseja contar e combine um momento para retomar. Se o sofrimento persistir ou surgirem relatos de violência, procure apoio adequado.',
      today: 'Escolha um momento tranquilo e faça a pergunta aberta.',
      next: 'Retome a conversa depois e observe se a mudança persiste.',
      risk: 'Se aparecer relato de ameaça, violência ou sofrimento intenso, priorize apoio adulto e proteção.'
    },
    alone: {
      label: 'Você percebeu que ele parece mais sozinho.',
      intro: 'Menos contato com colegas não explica, por si só, o que a criança sente. Convide sem pressionar.',
      script: 'Tenho percebido que você passa mais tempo sozinho. Como você tem se sentido na escola?',
      follow: 'Se ele quiser continuar: “Com quem ou em que momentos você se sente mais à vontade?”',
      title: 'Entenda como ele vive essa fase',
      body: 'Pergunte sobre momentos bons e difíceis da escola e sobre pessoas com quem ele se sente à vontade. Se o afastamento vier com sofrimento persistente, considere conversar com a escola e buscar profissionais.',
      today: 'Pergunte como ele tem se sentido, sem tratar ficar sozinho como um defeito.',
      next: 'Combine uma nova conversa e observe se há sofrimento persistente.',
      risk: 'Se surgirem sinais de violência ou sofrimento intenso, procure apoio adequado sem esperar.'
    },
    excluded: {
      label: 'Ele relatou que ficou de fora.',
      intro: 'Acolha o relato antes de decidir o que ele significa. Pergunte como ele gostaria de ser apoiado.',
      script: 'Obrigado por me contar que você ficou de fora. Como foi para você? O que gostaria que eu soubesse?',
      follow: 'Se ele quiser continuar: “Isso aconteceu outras vezes? O que você gostaria que eu fizesse para ajudar?”',
      title: 'Acolha o relato e combine apoio',
      body: 'Procure entender o que aconteceu, com que frequência e como a criança gostaria de ser ajudada. Se a exclusão for persistente ou vier com agressão, converse com a escola sobre proteção e acompanhamento.',
      today: 'Agradeça a confiança, escute o relato e pergunte como ele quer ser apoiado.',
      next: 'Se a exclusão persistir, procure a escola para entender o contexto e combinar apoio.',
      risk: 'Se houver agressão, ameaça ou sofrimento intenso, priorize segurança e ajuda imediata.'
    },
    harm: {
      label: 'Ele relatou agressão ou ameaça.',
      intro: 'Antes de qualquer roteiro, verifique se a criança está segura. Não espere uma nova ocorrência para buscar apoio.',
      script: 'Obrigado por me contar. Você está seguro agora? Vou procurar ajuda com você.',
      follow: 'Depois de garantir segurança: “O que você precisa de mim neste momento?” Evite transformar a conversa em interrogatório.',
      title: 'Priorize segurança e apoio adulto',
      body: 'Leve o relato a sério. Procure a escola e os serviços adequados à gravidade para proteger a criança. Em risco imediato, use os serviços locais de emergência. Não deixe a criança resolver isso sozinha.',
      today: 'Verifique a segurança da criança e procure a escola ou serviços adequados sem esperar.',
      next: 'Combine com os adultos responsáveis como acompanhar e proteger a criança.',
      risk: 'Em risco imediato, use os serviços locais de emergência. Este roteiro não atende urgências.'
    }
  };

  const $ = id => document.getElementById(id);
  const choices = [...document.querySelectorAll('input[name="situation"]')];
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const defaultTalk = [
    'Escute até o fim, sem procurar um culpado naquele momento.',
    'Reconheça o sentimento: “Entendo que isso foi difícil”.',
    'Pergunte: “O que você gostaria que eu soubesse ou fizesse agora?”'
  ];
  const defaultPause = [
    'Respeite a pausa: “Tudo bem. Podemos conversar outro dia”.',
    'Mostre disponibilidade sem insistir.',
    'Observe se há sofrimento persistente ou sinais de risco.'
  ];
  const safetyTalk = [
    'Verifique primeiro se a criança está segura, antes de aprofundar o relato.',
    'Agradeça por ela contar e diga que buscará ajuda.',
    'Pergunte o que ela precisa neste momento, sem transformar a conversa em interrogatório.'
  ];
  const safetyPause = [
    'Não pressione por detalhes que a criança não quer dar agora.',
    'Diga que ela não precisa lidar com a situação sozinha.',
    'Mesmo sem todos os detalhes, procure apoio adulto e medidas de proteção.'
  ];

  function setList(id, items) {
    $(id).querySelectorAll('li').forEach((li, index) => { li.textContent = items[index]; });
  }

  function show(step) {
    document.querySelectorAll('.step').forEach(section => { section.hidden = Number(section.dataset.step) !== step; });
    $('step-counter').textContent = `PASSO ${step} DE 3`;
    $('step-name').textContent = names[step - 1];
    $('progress-fill').style.width = `${step / 3 * 100}%`;
    const heading = document.querySelector(`.step[data-step="${step}"] h2`);
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    $('roteiro').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function renderConversation() {
    const item = scenarios[situation];
    $('conversation-intro').textContent = item.intro;
    $('script-text').textContent = `“${item.script}”`;
    $('follow-up-text').textContent = item.follow;
    $('conversation-alert').hidden = situation !== 'harm';
    setList('talk-list', situation === 'harm' ? safetyTalk : defaultTalk);
    setList('pause-list', situation === 'harm' ? safetyPause : defaultPause);
    $('copy-status').textContent = '';
  }

  function renderResult() {
    const item = scenarios[situation];
    const box = $('recommendation');
    box.replaceChildren();
    const eyebrow = document.createElement('span'); eyebrow.textContent = 'UM CAMINHO POSSÍVEL';
    const heading = document.createElement('h3'); heading.textContent = item.title;
    const body = document.createElement('p'); body.textContent = item.body;
    box.append(eyebrow, heading, body);
    $('plan-today').textContent = item.today;
    $('plan-next').textContent = item.next;
    $('plan-risk').textContent = item.risk;
    $('summary-text').textContent = item.label;
    $('summary-script').textContent = `“${item.script}”`;
    $('summary-action').textContent = item.today;
    $('summary-next').textContent = item.next;
    $('school-template').open = situation === 'excluded' || situation === 'harm';
  }

  async function copy(text, statusId) {
    const status = $(statusId);
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Copiado.';
    } catch {
      status.textContent = 'Selecione e copie o texto acima.';
    }
  }

  choices.forEach(input => {
    input.addEventListener('change', () => {
      situation = input.value;
      choices.forEach(choice => choice.closest('.choice').classList.toggle('selected', choice.checked));
      $('early-alert').hidden = situation !== 'harm';
      $('choice-error').textContent = '';
    });
  });

  $('to-two').addEventListener('click', () => {
    if (!situation) {
      $('choice-error').textContent = 'Escolha a opção que mais se aproxima para continuar.';
      return;
    }
    renderConversation();
    show(2);
  });
  $('to-three').addEventListener('click', () => { renderResult(); show(3); });
  document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.back))));
  $('copy-script').addEventListener('click', () => copy(scenarios[situation].script, 'copy-status'));
  $('copy-school').addEventListener('click', () => copy($('school-text').textContent.trim(), 'school-status'));
  $('print').addEventListener('click', () => window.print());
  $('restart').addEventListener('click', () => {
    situation = null;
    choices.forEach(choice => { choice.checked = false; choice.closest('.choice').classList.remove('selected'); });
    $('early-alert').hidden = true;
    $('copy-status').textContent = '';
    $('school-status').textContent = '';
    show(1);
  });
})();
