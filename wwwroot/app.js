const api = {
  feeds: () => fetch('/feeds').then(r => r.json()),
  addFeed: (url) => fetch('/feeds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  }),
  deleteFeed: (id) => fetch('/feeds/' + id, { method: 'DELETE' }),
  refreshFeed: (id) => fetch('/feeds/' + id + '/refresh', { method: 'POST' }),
  refreshAll: () => fetch('/feeds/refresh', { method: 'POST' }),
  river: () => fetch('/river').then(r => r.json()),
};

const state = {
  feeds: [],
  articles: [],
  selected: 'all',
  search: '',
  page: 1,
  fields: { source: true, date: true, author: false, excerpt: true },
  sort: 'newest',
  pageSize: 10,
  grouped: false,
  expanded: new Set(), // groups the user has opened (default: all collapsed)
  theme: 'light',
  seen: new Set(),      // keys of articles we've already shown
  newKeys: new Set(),   // keys highlighted as NEW after a refresh
  firstLoad: true,
};

// ---------- helpers ----------
function timeAgo(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
  const mo = Math.floor(d / 30); if (mo < 12) return mo + 'mo ago';
  return Math.floor(mo / 12) + 'y ago';
}
function fmtAbsolute(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}
function safeHref(url) {
  return (typeof url === 'string' && /^https?:\/\//i.test(url)) ? url : null;
}
function countFor(url) { return state.articles.filter(a => a.sourceFeedUrl === url).length; }
function feedByUrl(url) { return state.feeds.find(f => f.url === url); }
function keyOf(a) { return a.link || ((a.sourceFeedUrl || '') + '|' + (a.title || '')); }

// Flag articles we haven't seen before as NEW (skipped on the very first load).
function markNew(articles) {
  state.newKeys = new Set();
  if (state.firstLoad) {
    for (const a of articles) state.seen.add(keyOf(a));
    state.firstLoad = false;
    return;
  }
  for (const a of articles) {
    const k = keyOf(a);
    if (!state.seen.has(k)) state.newKeys.add(k);
    state.seen.add(k);
  }
}

// ---------- theme ----------
function applyTheme(theme) {
  state.theme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = state.theme === 'dark' ? '☀' : '☾';
  try { localStorage.setItem('rss-theme', state.theme); } catch { /* ignore */ }
}

// ---------- loading skeleton ----------
function renderSkeleton(n) {
  n = n || 6;
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
  document.getElementById('pagination').hidden = true;
  for (let i = 0; i < n; i++) {
    const c = document.createElement('article');
    c.className = 'card skeleton';
    c.innerHTML =
      '<div class="sk sk-head"></div>' +
      '<div class="sk sk-title"></div>' +
      '<div class="sk sk-line"></div>' +
      '<div class="sk sk-line short"></div>';
    cards.appendChild(c);
  }
}

// ---------- data ----------
async function loadAll() {
  renderSkeleton();
  // Fire both requests together, but show the sidebar as soon as feeds arrive
  // (fast) instead of waiting for all articles (slow); cards keep the skeleton.
  const feedsP = api.feeds().catch(() => []);
  const riverP = api.river().catch(() => []);

  state.feeds = (await feedsP) || [];
  if (state.selected !== 'all' && !feedByUrl(state.selected)) state.selected = 'all';
  renderSidebar();

  state.articles = (await riverP) || [];
  markNew(state.articles);
  renderSidebar(); // refresh badge counts now that articles are in
  renderCards();
}
async function reloadArticles() {
  renderSkeleton();
  state.articles = await api.river().catch(() => state.articles);
  markNew(state.articles);
  renderSidebar();
  renderCards();
}

// ---------- sidebar ----------
function renderSidebar() {
  const nav = document.getElementById('feed-nav');
  nav.innerHTML = '';
  nav.appendChild(navItem('all', 'All Feeds', state.articles.length, null));
  for (const feed of state.feeds) {
    nav.appendChild(navItem(feed.url, feed.name, countFor(feed.url), feed));
  }
}

function navItem(key, label, count, feed) {
  const item = document.createElement('div');
  item.className = 'nav-item' + (state.selected === key ? ' active' : '');

  const name = document.createElement('span');
  name.className = 'nav-name';
  name.textContent = label;
  name.title = feed ? feed.url : 'All feeds';

  const meta = document.createElement('span');
  meta.className = 'nav-meta';

  // Icons first (appear on hover, to the LEFT of the badge) ...
  if (feed) {
    const refresh = document.createElement('button');
    refresh.className = 'nav-refresh';
    refresh.title = 'Refresh feed';
    refresh.textContent = '⟳';
    refresh.addEventListener('click', async (e) => {
      e.stopPropagation();
      refresh.disabled = true;
      await api.refreshFeed(feed.id);
      await reloadArticles();
    });
    meta.appendChild(refresh);

    const del = document.createElement('button');
    del.className = 'nav-del';
    del.title = 'Remove feed';
    del.textContent = '🗑';
    del.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Remove "' + feed.name + '"?')) return;
      await api.deleteFeed(feed.id);
      if (state.selected === feed.url) state.selected = 'all';
      await loadAll();
    });
    meta.appendChild(del);
  }

  // ... badge last, pinned to the far right.
  const badge = document.createElement('span');
  badge.className = 'nav-badge';
  badge.textContent = count;
  meta.appendChild(badge);

  item.append(name, meta);
  item.addEventListener('click', () => {
    state.selected = key;
    state.page = 1;
    // Grouping a single feed is pointless — drop back to the flat list.
    if (key !== 'all' && state.grouped) {
      state.grouped = false;
      document.getElementById('group-toggle').classList.remove('active');
      try { localStorage.setItem('rss-grouped', '0'); } catch { /* ignore */ }
    }
    renderSidebar();
    renderCards();
  });
  return item;
}

// ---------- filtering / sorting ----------
function filteredArticles() {
  let list = state.selected === 'all'
    ? state.articles
    : state.articles.filter(a => a.sourceFeedUrl === state.selected);

  const q = state.search.trim().toLowerCase();
  if (q) {
    list = list.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.summary || '').toLowerCase().includes(q));
  }

  list = list.slice();
  list.sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return state.sort === 'oldest' ? ta - tb : tb - ta;
  });
  return list;
}

// ---------- rendering ----------
function renderCards() {
  const feed = state.selected === 'all' ? null : feedByUrl(state.selected);
  document.getElementById('view-name').textContent = feed ? feed.name : 'All Feeds';

  // Grouping only makes sense across all feeds — disable it when viewing one.
  document.getElementById('group-toggle').disabled = state.selected !== 'all';

  const list = filteredArticles();
  const total = list.length;
  document.getElementById('view-count').textContent = '(' + total + ')';

  const cards = document.getElementById('cards');
  cards.innerHTML = '';

  if (state.feeds.length === 0) {
    cards.innerHTML = '<p class="state">No feeds yet. Add one from the sidebar to get started.</p>';
    renderPagination(0);
    return;
  }
  if (total === 0) {
    cards.innerHTML = '<p class="state">No articles' + (state.search ? ' match your search.' : ' yet. Try “Refresh all”.') + '</p>';
    renderPagination(0);
    return;
  }

  if (state.grouped) {
    renderGrouped(list);
    renderPagination(0);
    return;
  }

  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * state.pageSize;
  const pageItems = list.slice(start, start + state.pageSize);

  for (const a of pageItems) cards.appendChild(renderCard(a));
  renderPagination(total);
}

function renderGrouped(list) {
  const cards = document.getElementById('cards');

  const groups = new Map();
  for (const a of list) {
    if (!groups.has(a.sourceFeedUrl)) groups.set(a.sourceFeedUrl, []);
    groups.get(a.sourceFeedUrl).push(a);
  }

  // order groups by the sidebar feed order
  const ordered = state.feeds.map(f => f.url).filter(u => groups.has(u));
  for (const u of groups.keys()) if (!ordered.includes(u)) ordered.push(u);

  for (const url of ordered) {
    const items = groups.get(url);
    const feed = feedByUrl(url);
    const name = feed ? feed.name : (items[0].sourceFeedName || url);
    const collapsed = !state.expanded.has(url);

    const group = document.createElement('div');
    group.className = 'feed-group' + (collapsed ? ' collapsed' : '');

    const header = document.createElement('div');
    header.className = 'group-header';
    const caret = document.createElement('span');
    caret.className = 'group-caret';
    caret.textContent = collapsed ? '▶' : '▼';
    const gname = document.createElement('span');
    gname.textContent = name;
    const gcount = document.createElement('span');
    gcount.className = 'group-count';
    gcount.textContent = '(' + items.length + ')';
    header.append(caret, gname, gcount);
    header.addEventListener('click', () => {
      if (state.expanded.has(url)) state.expanded.delete(url);
      else state.expanded.add(url);
      renderCards();
    });

    const body = document.createElement('div');
    body.className = 'group-body';
    for (const a of items) body.appendChild(renderCard(a, true)); // hide redundant source

    group.append(header, body);
    cards.appendChild(group);
  }
}

function renderPagination(total) {
  const pag = document.getElementById('pagination');
  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  if (total === 0 || state.grouped || pages <= 1) { pag.hidden = true; return; }
  if (state.page > pages) state.page = pages;
  pag.hidden = false;
  document.getElementById('page-info').textContent = 'Page ' + state.page + ' of ' + pages;
  document.getElementById('prev').disabled = state.page <= 1;
  document.getElementById('next').disabled = state.page >= pages;
}

function renderCard(a, hideSource) {
  const card = document.createElement('article');
  card.className = 'card';
  const isNew = state.newKeys.has(keyOf(a));
  if (isNew) card.classList.add('new');

  const showSource = !hideSource && state.fields.source && a.sourceFeedName;
  const showDate = state.fields.date && a.publishedAt;
  if (showSource || showDate) {
    const head = document.createElement('div');
    head.className = 'card-head';
    if (showSource) {
      const src = document.createElement('span');
      src.className = 'card-source';
      src.textContent = a.sourceFeedName;
      head.appendChild(src);
    }
    if (showDate) {
      const t = document.createElement('span');
      t.textContent = (showSource ? ' / ' : '') + timeAgo(a.publishedAt);
      t.title = fmtAbsolute(a.publishedAt);
      head.appendChild(t);
    }
    card.appendChild(head);
  }

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = a.title || '(untitled)';
  if (isNew) {
    const badge = document.createElement('span');
    badge.className = 'new-badge';
    badge.textContent = 'NEW';
    title.appendChild(badge);
  }
  title.addEventListener('click', () => openArticle(a));
  card.appendChild(title);

  if (state.fields.author && a.author) {
    const author = document.createElement('div');
    author.className = 'card-author';
    author.textContent = 'by ' + a.author;
    card.appendChild(author);
  }

  if (state.fields.excerpt && a.summary) {
    const excerpt = document.createElement('p');
    excerpt.className = 'card-excerpt';
    excerpt.textContent = a.summary;
    card.appendChild(excerpt);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const expand = document.createElement('button');
  expand.className = 'card-icon';
  expand.title = 'Open full article at source';
  expand.textContent = '↗';
  expand.addEventListener('click', () => openArticle(a));
  actions.appendChild(expand);
  card.appendChild(actions);

  return card;
}

// Open the full article at its source (feeds usually only carry a summary).
// Falls back to the in-app modal for the rare article with no link.
function openArticle(a) {
  const href = safeHref(a.link);
  if (href) {
    window.open(href, '_blank', 'noopener,noreferrer');
  } else {
    openModal(a);
  }
}

// ---------- modal ----------
function openModal(a) {
  const content = document.getElementById('modal-content');
  content.innerHTML = '';

  const meta = document.createElement('div');
  meta.className = 'modal-meta';
  meta.textContent = (a.sourceFeedName || '') + (a.publishedAt ? ' / ' + timeAgo(a.publishedAt) : '');

  const title = document.createElement('h2');
  title.className = 'modal-title';
  const href = safeHref(a.link);
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = a.title || '(untitled)';
    title.appendChild(link);
  } else {
    title.textContent = a.title || '(untitled)';
  }

  content.append(meta, title);

  if (a.author) {
    const author = document.createElement('div');
    author.className = 'modal-author';
    author.textContent = 'by ' + a.author;
    content.appendChild(author);
  }

  const body = document.createElement('div');
  body.className = 'modal-body';
  if (a.contentHtml) body.innerHTML = a.contentHtml; // sanitized server-side
  else if (a.summary) body.textContent = a.summary;
  content.appendChild(body);

  if (href) {
    const more = document.createElement('a');
    more.className = 'modal-more';
    more.href = href;
    more.target = '_blank';
    more.rel = 'noopener noreferrer';
    more.textContent = 'Read full article ↗';
    content.appendChild(more);
  }

  document.getElementById('modal').hidden = false;
}
function closeModal() { document.getElementById('modal').hidden = true; }

// ---------- events ----------
document.getElementById('add-feed-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('feed-url');
  const errEl = document.getElementById('add-error');
  const submitBtn = document.getElementById('add-submit');
  errEl.hidden = true;

  const url = input.value.trim();
  if (!url) return;

  submitBtn.disabled = true;
  const res = await api.addFeed(url);
  submitBtn.disabled = false;

  if (res.ok) {
    input.value = '';
    await loadAll();
  } else {
    let msg = 'Could not add feed.';
    try { msg = await res.json(); } catch { try { msg = await res.text(); } catch { /* ignore */ } }
    errEl.textContent = (typeof msg === 'string' && msg) ? msg : 'Could not add feed.';
    errEl.hidden = false;
  }
});

document.getElementById('refresh-all').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = 'Refreshing…';
  await api.refreshAll();
  await reloadArticles();
  btn.textContent = '⟳ Refresh all';
  btn.disabled = false;
});

document.getElementById('search').addEventListener('input', (e) => {
  state.search = e.target.value;
  state.page = 1;
  renderCards();
});

document.getElementById('group-toggle').addEventListener('click', (e) => {
  state.grouped = !state.grouped;
  if (state.grouped) state.expanded.clear(); // start fully collapsed each time
  e.currentTarget.classList.toggle('active', state.grouped);
  try { localStorage.setItem('rss-grouped', state.grouped ? '1' : '0'); } catch { /* ignore */ }
  renderCards();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
});

document.getElementById('prev').addEventListener('click', () => {
  if (state.page > 1) { state.page--; renderCards(); scrollToTop(); }
});
document.getElementById('next').addEventListener('click', () => {
  state.page++; renderCards(); scrollToTop();
});
function scrollToTop() {
  document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ---------- init ----------
(function init() {
  let theme = 'light';
  try { theme = localStorage.getItem('rss-theme') || 'light'; } catch { /* ignore */ }
  applyTheme(theme);

  try { state.grouped = localStorage.getItem('rss-grouped') === '1'; } catch { /* ignore */ }
  document.getElementById('group-toggle').classList.toggle('active', state.grouped);

  loadAll();
})();
