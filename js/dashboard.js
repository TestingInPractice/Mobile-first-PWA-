const DASHBOARD = (() => {
  const container = document.getElementById('dashboard-content');

  async function load() {
    container.innerHTML = '<div style="text-align:center;padding:40px"><span class="spinner"></span><br><br>Загрузка фаз...</div>';

    try {
      if (!GITHUB.isReady()) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px;color:var(--text2)">
            🔑 Настрой GitHub токен в разделе <b>Настройки</b>
          </div>`;
        return;
      }

      const file = await GITHUB.getFile('.build-loop/phases.json');
      const data = JSON.parse(file.decoded);
      render(data);
    } catch (e) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--red)">
          ❌ Ошибка загрузки: ${e.message}
        </div>`;
    }
  }

  function render(data) {
    const meta = data.meta || {};
    let html = `
      <div style="margin-bottom:12px;font-size:12px;color:var(--text2)">
        ${escapeHtml(meta.project || '')} v${meta.version || '?'} · ${meta.loop_version || ''}
        · обновлено: ${meta.updated ? new Date(meta.updated).toLocaleString('ru-RU') : '—'}
      </div>`;

    for (const phase of data.phases) {
      const statusClass = `status-${phase.status}`;
      const statusLabel = phase.status === 'completed' ? '✅ Готово'
        : phase.status === 'in-progress' ? '🔄 В работе'
        : '⏳ Запланировано';

      const phaseName = phase.name || phase.title || '';
      const specDoc = `docs/specs/SPEC-${phase.id}.md`;
      const acDoc = `docs/specs/acceptance-criteria.md`;

      html += `
        <div class="phase-card ${statusClass}">
          <h3>${escapeHtml(phase.id)}: ${escapeHtml(phaseName)}</h3>
          <span class="status-badge">${statusLabel}</span>
          <p>${escapeHtml(phase.description || '')}</p>
          <div class="specs">
            <a href="${GITHUB.repoUrl(specDoc)}" target="_blank" rel="noopener">SPEC</a>
            <a href="${GITHUB.repoUrl(acDoc)}" target="_blank" rel="noopener">AC</a>
            ${(phase.depends_on || []).length ? phase.depends_on.map(d => `<a href="#" style="background:var(--surface2);color:var(--yellow)">⬅ ${escapeHtml(d)}</a>`).join('') : ''}
          </div>
          ${phase.acceptance_criteria && phase.acceptance_criteria.length ? `
          <div style="margin-top:6px;font-size:11px;color:var(--text2)">
            ${phase.acceptance_criteria.map(ac => `• ${escapeHtml(ac)}`).join('<br>')}
          </div>` : ''}
        </div>`;
    }

    container.innerHTML = html;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s || '';
    return div.innerHTML;
  }

  return { load };
})();
