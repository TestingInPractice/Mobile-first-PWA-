document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = {
    chat: document.getElementById('chat-panel'),
    dashboard: document.getElementById('dashboard-panel'),
    settings: document.getElementById('settings-panel')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.keys(panels).forEach(k => panels[k].classList.toggle('active', k === btn.dataset.tab));
      if (btn.dataset.tab === 'dashboard') DASHBOARD.load();
    });
  });

  // Settings: load saved values
  const tokenInput = document.getElementById('token-input');
  const ownerInput = document.getElementById('owner-input');
  const repoInput = document.getElementById('repo-input');

  tokenInput.value = localStorage.getItem('github_token') || '';
  ownerInput.value = localStorage.getItem('github_owner') || GITHUB.OWNER;
  repoInput.value = localStorage.getItem('github_repo') || GITHUB.REPO;

  tokenInput.addEventListener('input', () => {
    localStorage.setItem('github_token', tokenInput.value);
  });

  ownerInput.addEventListener('input', () => {
    localStorage.setItem('github_owner', ownerInput.value);
  });

  repoInput.addEventListener('input', () => {
    localStorage.setItem('github_repo', repoInput.value);
  });

  // Test connection
  document.getElementById('test-connection').addEventListener('click', async () => {
    const btn = document.getElementById('test-connection');
    btn.disabled = true;
    btn.textContent = 'Проверяю...';
    try {
      const user = await fetch('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${tokenInput.value}`, 'Accept': 'application/vnd.github+json' }
      }).then(r => r.json());
      if (user.login) {
        showToast(`✅ Подключено: ${user.login}`);
        document.getElementById('token-status').textContent = `Статус: подключено (${user.login})`;
        document.getElementById('token-status').style.color = 'var(--green)';
      } else {
        showToast(`❌ ${user.message || 'Ошибка'}`);
        document.getElementById('token-status').textContent = 'Статус: не подключено';
        document.getElementById('token-status').style.color = 'var(--red)';
      }
    } catch (e) {
      showToast(`❌ ${e.message}`);
    }
    btn.disabled = false;
    btn.textContent = 'Проверить соединение';
  });

  // Init chat
  CHAT.init();

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
