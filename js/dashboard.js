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

      html += `
        <div class="phase-card ${statusClass}">
          <h3>${escapeHtml(phase.id)}: ${escapeHtml(phase.title)}</h3>
          <span class="status-badge">${statusLabel}</span>
          <p>${escapeHtml(phase.description || '')}</p>
          <div class="specs">`;

      const specLinks = [
        { label: 'SPEC', path: phase.spec },
        { label: 'AC', path: phase.acceptance_criteria },
        ...(phase.contracts || []).map(c => ({ label: c.split('/').pop(), path: c }))
      ];

      for (const link of specLinks) {
        if (link.path) {
          const url = GITHUB.repoUrl(link.path);
          html += `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`;
        }
      }

      html += `</div></div>`;
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
