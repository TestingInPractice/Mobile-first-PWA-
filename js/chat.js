const CHAT = (() => {
  const container = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  function addMessage(text, role) {
    const el = document.createElement('div');
    el.className = `msg ${role}`;
    el.innerHTML = text;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function addSystem(text) {
    addMessage(text, 'system');
  }

  function loadingId() {
    const id = 'loading-' + Date.now();
    const el = document.createElement('div');
    el.className = 'msg assistant';
    el.id = id;
    el.innerHTML = '<span class="spinner"></span> Думаю...';
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function replaceLoading(id, text) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = `<div class="msg assistant">${text}</div>`;
    container.scrollTop = container.scrollHeight;
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendBtn.disabled = true;

    addMessage(escapeHtml(text), 'user');

    if (text.startsWith('/')) {
      await handleCommand(text);
    } else {
      await handlePrompt(text);
    }

    sendBtn.disabled = false;
    input.focus();
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  async function handlePrompt(text) {
    const lid = loadingId();
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const responses = [
      `Принято. В режиме <span class="cmd">планирования</span> я могу:\n• Создавать SPEC/TZ/Acceptance Criteria\n• Разбивать задачи на подзадачи (<span class="cmd">/decompose</span>)\n• Создавать Issues (<span class="cmd">/exec</span>)\n• Показывать статус фаз (<span class="cmd">/status</span>)`,
      `Понял задачу. Для планирования рекомендую:\n1. Написать SPEC в `.build-loop/specs/\`\n2. Создать AC (acceptance criteria)\n3. Закрепить контракты\n\nИспользуй <span class="cmd">создай файл specs/...</span> чтобы начать.`,
      `В режиме планирования фиксирую:\n\n<span class="cmd">→</span> Требования\n<span class="cmd">→</span> Границы (scope)\n<span class="cmd">→</span> Критерии приёмки\n\nЧто дальше? Могу создать SPEC.md или разбить на фазы.`,
      `Записал. Это попадает в <span class="cmd">фазу планирования</span>. Чтобы оформить как SPEC, напиши:\n\n<code>создай файл specs/SPEC-XXX-описание.md с содержанием: ...</code>`
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    replaceLoading(lid, reply);
  }

  async function handleCommand(text) {
    const lid = loadingId();

    if (text === '/status') {
      await cmdStatus(lid);
    } else if (text.startsWith('/decompose ')) {
      const task = text.slice('/decompose '.length).trim();
      await cmdDecompose(lid, task);
    } else if (text.startsWith('/exec ')) {
      const phaseId = text.slice('/exec '.length).trim();
      await cmdExec(lid, phaseId);
    } else if (text.startsWith('/help')) {
      removeLoading(lid);
      showHelp();
    } else {
      removeLoading(lid);
      addSystem(`Неизвестная команда. Напиши /help для списка команд.`);
    }
  }

  async function cmdStatus(loadingId) {
    try {
      const file = await GITHUB.getFile('.build-loop/phases.json');
      const data = JSON.parse(file.decoded);
      let html = '<span class="cmd">📊 Статус фаз:</span><br><br>';
      for (const p of data.phases) {
        const emoji = p.status === 'completed' ? '✅' : p.status === 'in-progress' ? '🔄' : '⏳';
        html += `${emoji} <b>${p.id}</b> — ${escapeHtml(p.name || p.title)} <span class="status-ok">(${p.status})</span><br>`;
      }
      replaceLoading(loadingId, html);
    } catch (e) {
      replaceLoading(loadingId, `Ошибка загрузки phases.json: <span class="status-err">${e.message}</span>`);
    }
  }

  async function cmdDecompose(loadingId, task) {
    await new Promise(r => setTimeout(r, 800));
    const subTasks = [
      `Анализ: "${task}" — определить scope и границы`,
      `SPEC: написать SPEC.md с функциональными требованиями`,
      `Acceptance Criteria: определить критерии приёмки`,
      `Contracts: описать интерфейсные контракты`
    ];

    let html = `<span class="cmd">🔨 Декомпозиция задачи:</span> "${escapeHtml(task)}"<br><br>`;
    for (const st of subTasks) {
      html += `📌 ${escapeHtml(st)}<br>`;
    }
    html += `<br><span class="status-ok">→ Используй /exec p1-p6 для запуска фазы</span>`;
    replaceLoading(loadingId, html);
  }

  async function cmdExec(loadingId, phaseId) {
    if (!GITHUB.isReady()) {
      replaceLoading(loadingId, `<span class="status-err">❌ GitHub токен не настроен. Перейди в настройки и добавь PAT.</span>`);
      return;
    }

    await new Promise(r => setTimeout(r, 500));

    try {
      const file = await GITHUB.getFile('.build-loop/phases.json');
      const data = JSON.parse(file.decoded);
      const phase = data.phases.find(p => p.id === phaseId);
      if (!phase) {
        replaceLoading(loadingId, `<span class="status-err">Фаза ${phaseId} не найдена</span>`);
        return;
      }

      const skillName = phase.id.replace(/^p/, 'p') + '-' + (phase.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const skillMapping = {
        'p1': 'p1-pwa-skeleton',
        'p2': 'p2-chat',
        'p3': 'p3-github-api',
        'p4': 'p4-dashboard',
        'p5': 'p5-workflow',
        'p6': 'p6-validation'
      };
      const skillRef = `.workflow/skills/${skillMapping[phaseId] || skillName}/SKILL.md`;

      let result = `<span class="cmd">🚀 Sub-agent pipeline для ${phaseId}:</span> "${escapeHtml(phase.name)}"<br><br>`;

      // Step 1: Create Issues (sub-agent delegation)
      const issues = [
        { title: `[${phase.id}] SPEC: ${phase.name}`, body: `Создать SPEC для фазы ${phase.id}. Skill: ${skillRef}` },
        { title: `[${phase.id}] AC: ${phase.name}`, body: `Создать Acceptance Criteria для фазы ${phase.id}` },
        { title: `[${phase.id}] Execute: ${phase.name}`, body: `Реализовать фазу согласно SPEC. Judge: scripts/judge/llm-judge.py` }
      ];

      const issueNumbers = [];
      for (const iss of issues) {
        try {
          const created = await GITHUB.createIssue(iss.title, iss.body, ['sub-agent', 'phase', phaseId]);
          issueNumbers.push(created.number);
          result += `<span class="status-ok">✅</span> Issue #${created.number}: ${escapeHtml(iss.title)}<br>`;
        } catch (e) {
          result += `<span class="status-err">❌</span> ${escapeHtml(iss.title)}: ${escapeHtml(e.message)}<br>`;
        }
      }

      // Step 2: Write subagent-handoff.json
      try {
        const handoff = {
          phase: { id: phase.id, name: phase.name, status: 'in-progress' },
          skill_ref: skillRef,
          spec_paths: [
            'docs/specs/goals.md',
            `docs/specs/SPEC-${phase.id}.md`,
            'docs/specs/acceptance-criteria.md',
            'docs/specs/contracts/api.md',
            'docs/specs/contracts/data-models.md'
          ],
          judge_verdict: null,
          judge_score: null,
          status: null,
          summary: null,
          evidence: [],
          open_questions: [],
          issue_numbers: issueNumbers
        };
        await GITHUB.createFile('.workflow/subagent-handoff.json', JSON.stringify(handoff, null, 2), `chore: sub-agent handoff for ${phase.id}`);
        result += `<span class="status-ok">✅</span> .workflow/subagent-handoff.json — handoff создан<br>`;
      } catch (e) {
        result += `<span class="status-err">❌</span> handoff: ${escapeHtml(e.message)}<br>`;
      }

      // Step 3: Update phases.json
      const updated = await GITHUB.updatePhasesJson(phases => {
        const p = phases.phases.find(x => x.id === phaseId);
        if (p && p.status !== 'completed') p.status = 'in-progress';
        return phases;
      });

      result += `<span class="status-ok">✅</span> phases.json обновлён: ${phaseId} → in-progress<br><br>`;
      result += `<span class="cmd">🔁 Pipeline:</span> decompose → <b>handoff</b> → Issues → execute → judge<br>`;
      result += `Открой 🤖 <b>SubAgents</b> чтобы увидеть handoff и skill`;
      replaceLoading(loadingId, result);
    } catch (e) {
      replaceLoading(loadingId, `<span class="status-err">Ошибка: ${escapeHtml(e.message)}</span>`);
    }
  }

  function showHelp() {
    addSystem('📋 Доступные команды:');
    const helpText = `
      <b>/decompose &lt;задача&gt;</b> — разбить задачу на подзадачи<br>
      <b>/exec &lt;phase-id&gt;</b> — запустить фазу (создать Issues, обновить статус)<br>
      <b>/status</b> — показать статус всех фаз<br>
      <b>/help</b> — эта справка<br><br>
      <span class="text2">Любой другой текст → opencode отвечает в режиме планирования</span>
    `;
    addMessage(helpText, 'assistant');
  }

  function init() {
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    addSystem('🧠 opencode | CodeAI Build Loop — режим планирования');
    addMessage('Привет! Я opencode в режиме планирования. Расскажи, что будем проектировать. Доступны команды: /decompose, /exec, /status, /help', 'assistant');
  }

  return { init };
})();
