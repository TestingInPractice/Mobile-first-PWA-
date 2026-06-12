const GITHUB = (() => {
  const BASE = 'https://api.github.com';
  const OWNER = 'TestingInPractice';
  const REPO = 'Mobile-first-PWA-';

  function token() { return localStorage.getItem('github_token') || ''; }

  function headers() {
    const t = token();
    const h = { 'Accept': 'application/vnd.github+json' };
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
  }

  async function api(method, path, body) {
    const url = `${BASE}${path}`;
    const opts = { method, headers: headers() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  }

  async function createFile(path, content, message) {
    const existing = await getFile(path).catch(() => null);
    const sha = existing ? existing.sha : undefined;
    const body = {
      message: message || `feat: ${path}`,
      content: btoa(unescape(encodeURIComponent(content)))
    };
    if (sha) body.sha = sha;
    return api('PUT', `/repos/${OWNER}/${REPO}/contents/${path}`, body);
  }

  async function getFile(path) {
    const data = await api('GET', `/repos/${OWNER}/${REPO}/contents/${path}`);
    if (data.content) {
      data.decoded = decodeURIComponent(escape(atob(data.content)));
    }
    return data;
  }

  async function createIssue(title, bodyText, labels) {
    return api('POST', `/repos/${OWNER}/${REPO}/issues`, {
      title,
      body: bodyText,
      labels: labels || ['sub-agent', 'phase']
    });
  }

  async function listIssues(labels) {
    const q = `repo:${OWNER}/${REPO}${labels ? ' label:' + labels.join(',label:') : ''}`;
    return api('GET', `/search/issues?q=${encodeURIComponent(q)}`);
  }

  function repoUrl(path) {
    path = path.replace(/^\//, '');
    return `https://github.com/${OWNER}/${REPO}/blob/main/${path}`;
  }

  async function updatePhasesJson(updaterFn) {
    const file = await getFile('.build-loop/phases.json');
    const phases = JSON.parse(file.decoded);
    const result = updaterFn(phases);
    await createFile('.build-loop/phases.json', JSON.stringify(result, null, 2), 'chore: update phases.json');
    return result;
  }

  function isReady() { return !!token(); }

  return { createFile, getFile, createIssue, listIssues, repoUrl, updatePhasesJson, isReady, OWNER, REPO };
})();
