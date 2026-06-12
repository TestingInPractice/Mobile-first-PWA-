const SUBAGENTS = (() => {
  const container = document.getElementById('subagents-content');

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s || '';
    return div.innerHTML;
  }

  async function load() {
    container.innerHTML = '<div style="text-align:center;padding:40px"><span class="spinner"></span><br><br>Загрузка Sub-Agent протокола...</div>';

    try {
      if (!GITHUB.isReady()) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">🔑 Настрой GitHub токен в разделе Настройки</div>';
        return;
      }

      const handoff = await GITHUB.getFile('.workflow/subagent-handoff.json').then(r => JSON.parse(r.decoded)).catch(() => null);
      const phasesFile = await GITHUB.getFile('.build-loop/phases.json').then(r => JSON.parse(r.decoded)).catch(() => null);

      render(handoff, phasesFile);
    } catch (e) {
      container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--red)">❌ Ошибка: ${escapeHtml(e.message)}</div>`;
    }
  }

  function render(handoff, phasesFile) {
    let html = '';

    // Current Handoff
    html += '<div class="sub-section"><h3>📋 Текущий Handoff</h3>';
    if (handoff && handoff.phase) {
      const p = handoff.phase;
      const statusIcon = p.status === 'completed' ? '✅' : p.status === 'in-progress' ? '🔄' : '⏳';
      html += `
        <div class="handoff-card">
          <div class="handoff-row"><span class="label">Phase</span><span>${escapeHtml(p.id)}: ${escapeHtml(p.name)}</span></div>
          <div class="handoff-row"><span class="label">Status</span><span>${statusIcon} ${p.status}</span></div>
          <div class="handoff-row"><span class="label">Skill</span><code>${escapeHtml(handoff.skill_ref || '—')}</code></div>
          <div class="handoff-row"><span class="label">Verdict</span>${verdictBadge(handoff.judge_verdict)}</div>
          <div class="handoff-row"><span class="label">Score</span><span>${handoff.judge_score != null ? handoff.judge_score + '/100' : '—'}</span></div>
          ${handoff.summary ? `<div class="handoff-row"><span class="label">Summary</span><span>${escapeHtml(handoff.summary)}</span></div>` : ''}
          ${handoff.evidence && handoff.evidence.length ? `<div class="handoff-row"><span class="label">Evidence</span><span>${handoff.evidence.map(e => '📄 ' + escapeHtml(e)).join('<br>')}</span></div>` : ''}
        </div>`;
    } else {
      html += '<div style="color:var(--text2);padding:12px;">Нет активного handoff. Запусти /exec чтобы создать.</div>';
    }
    html += '</div>';

    // Available Skills
    html += '<div class="sub-section"><h3>🛠 Доступные Skills</h3>';
    const skills = [
      { id: 'p1-pwa-skeleton', phase: 'p1', status: 'completed' },
      { id: 'p2-chat', phase: 'p2', status: 'completed' },
      { id: 'p3-github-api', phase: 'p3', status: 'completed' },
      { id: 'p4-dashboard', phase: 'p4', status: 'completed' },
      { id: 'p5-workflow', phase: 'p5', status: 'in-progress' },
      { id: 'p6-validation', phase: 'p6', status: 'planned' }
    ];

    for (const skill of skills) {
      const isActive = handoff && handoff.skill_ref && handoff.skill_ref.includes(skill.id);
      const statusIcon = skill.status === 'completed' ? '✅' : skill.status === 'in-progress' ? '🔄' : '⏳';
      html += `
        <div class="skill-card ${isActive ? 'active' : ''}">
          <span class="skill-name">${statusIcon} ${escapeHtml(skill.id)}</span>
          <span class="skill-phase">${escapeHtml(skill.phase)}</span>
          <a href="#" class="skill-view" data-skill="${escapeHtml(skill.id)}">view</a>
        </div>`;
    }
    html += '</div>';

    // Judge Protocol
    html += '<div class="sub-section"><h3>⚖️ Judge Protocol</h3>';
    html += `
      <div class="judge-card">
        <div class="handoff-row"><span class="label">Судья</span><code>scripts/judge/llm-judge.py</code></div>
        <div class="handoff-row"><span class="label">Rubrics</span><span>.workflow/judge-rubrics/{analyst,developer,tester}.json</span></div>
        <div class="handoff-row"><span class="label">Порог</span><span>≥ 0.8 (80%)</span></div>
        <div style="margin-top:8px;font-size:12px;color:var(--text2)">
          Sub-agent пишет summary → judge проверяет AC → PASS/FAIL → verdict в handoff
        </div>
      </div>`;
    html += '</div>';

    // Protocol diagram
    html += '<div class="sub-section"><h3>🔁 Pipeline</h3>';
    html += `
      <div class="pipeline">
        <div class="pipeline-step">1️⃣ Orchestrator<br><span class="sub">читает phases.json</span></div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-step">2️⃣ Handoff<br><span class="sub">пишет handoff.json</span></div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-step">3️⃣ Sub-agent<br><span class="sub">task() свежая сессия</span></div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-step">4️⃣ Judge<br><span class="sub">llm-judge.py</span></div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-step">5️⃣ Verdict<br><span class="sub">PASS / FAIL</span></div>
      </div>`;
    html += '</div>';

    container.innerHTML = html;

    // Skill view click handlers
    container.querySelectorAll('.skill-view').forEach(el => {
      el.addEventListener('click', async e => {
        e.preventDefault();
        const skillId = e.target.dataset.skill;
        await showSkill(skillId);
      });
    });
  }

  async function showSkill(skillId) {
    const skillPath = `.workflow/skills/${skillId}/SKILL.md`;
    container.innerHTML = '<div style="text-align:center;padding:40px"><span class="spinner"></span></div>';
    try {
      const file = await GITHUB.getFile(skillPath);
      const html = `
        <div style="padding:16px">
          <button id="back-to-subagents" style="background:none;border:none;color:var(--accent2);font-size:14px;cursor:pointer;margin-bottom:12px">← Назад</button>
          <h3 style="margin-bottom:8px">📄 ${escapeHtml(skillId)}/SKILL.md</h3>
          <pre style="background:var(--surface);padding:12px;border-radius:8px;font-size:13px;white-space:pre-wrap;color:var(--text)">${escapeHtml(file.decoded)}</pre>
        </div>`;
      container.innerHTML = html;
      document.getElementById('back-to-subagents').addEventListener('click', load);
    } catch (e) {
      container.innerHTML = `<div style="padding:16px"><button id="back-to-subagents" style="background:none;border:none;color:var(--accent2);font-size:14px;cursor:pointer;margin-bottom:12px">← Назад</button><div style="color:var(--red)">❌ ${escapeHtml(e.message)}</div></div>`;
      document.getElementById('back-to-subagents').addEventListener('click', load);
    }
  }

  function verdictBadge(v) {
    if (!v) return '<span style="color:var(--text2)">⏳ ожидание</span>';
    if (v === 'passed') return '<span class="status-ok" style="font-weight:600">✅ PASSED</span>';
    return '<span class="status-err" style="font-weight:600">❌ FAILED</span>';
  }

  return { load };
})();
