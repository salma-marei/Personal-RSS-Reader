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

const i18n = {
  en: {
    add: 'Add',
    addFeedUrl: 'Add feed URL...',
    allFeeds: 'All Feeds',
    backToTop: 'Head to the top!',
    by: 'by',
    close: 'Close',
    couldNotAddFeed: 'Could not add feed.',
    feeds: 'Feeds',
    justNow: 'just now',
    langToggle: 'ع',
    loading: 'Loading...',
    new: 'NEW',
    noArticlesMatch: 'No articles match your search.',
    noArticlesYet: 'No articles yet. Try "Refresh all".',
    noFeeds: 'No feeds yet. Add one from the sidebar to get started.',
    duplicateFeed: 'This feed is already in your subscriptions.',
    invalidFeed: 'Not a valid RSS/Atom feed.',
    openFullArticle: 'Open full article at source',
    readFullArticle: 'Read full article',
    refreshAll: 'Refresh all',
    refreshFeed: 'Refresh feed',
    refreshing: 'Refreshing...',
    removeFeed: 'Remove feed',
    removeFeedConfirm: 'Remove "{name}"?',
    search: 'Search',
    switchLanguage: 'Switch language',
    themeDark: 'Switch to dark mode',
    themeLight: 'Switch to light mode',
    untitled: '(untitled)',
    urlRequired: 'URL is required.',
    units: { m: 'm ago', h: 'h ago', d: 'd ago', mo: 'mo ago', y: 'y ago' },
  },
  ar: {
    add: 'إضافة',
    addFeedUrl: 'أضف رابط الخلاصة...',
    allFeeds: 'كل الخلاصات',
    backToTop: 'العودة للأعلى',
    by: 'بواسطة',
    close: 'إغلاق',
    couldNotAddFeed: 'تعذر إضافة الخلاصة.',
    feeds: 'الخلاصات',
    justNow: 'الآن',
    langToggle: 'EN',
    loading: 'جار التحميل...',
    new: 'جديد',
    noArticlesMatch: 'لا توجد مقالات تطابق البحث.',
    noArticlesYet: 'لا توجد مقالات بعد. جرّب "تحديث الكل".',
    noFeeds: 'لا توجد خلاصات بعد. أضف واحدة من الشريط الجانبي للبدء.',
    duplicateFeed: 'هذه الخلاصة موجودة بالفعل في اشتراكاتك.',
    invalidFeed: 'هذا الرابط ليس خلاصة RSS/Atom صالحة.',
    openFullArticle: 'فتح المقالة كاملة من المصدر',
    readFullArticle: 'قراءة المقالة كاملة',
    refreshAll: 'تحديث الكل',
    refreshFeed: 'تحديث الخلاصة',
    refreshing: 'جار التحديث...',
    removeFeed: 'حذف الخلاصة',
    removeFeedConfirm: 'حذف "{name}"؟',
    search: 'بحث',
    switchLanguage: 'تغيير اللغة',
    themeDark: 'التبديل إلى الوضع الداكن',
    themeLight: 'التبديل إلى الوضع الفاتح',
    untitled: '(بدون عنوان)',
    urlRequired: 'رابط الخلاصة مطلوب.',
    units: { m: 'د', h: 'س', d: 'ي', mo: 'شهر', y: 'سنة' },
  },
};

const state = {
  feeds: [],
  articles: [],
  selected: 'all',
  feedsCollapsed: false,
  search: '',
  fields: { source: true, date: true, author: false, excerpt: true },
  sort: 'newest',
  theme: 'light',
  lang: 'en',
  seen: new Set(),      // keys of articles we've already shown
  newKeys: new Set(),   // keys highlighted as NEW after a refresh
  firstLoad: true,
};

// ---------- helpers ----------
function t(key) {
  return i18n[state.lang][key] || i18n.en[key] || key;
}

function timeAgo(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return t('justNow');
  const units = i18n[state.lang].units || i18n.en.units;
  const m = Math.floor(s / 60); if (m < 60) return state.lang === 'ar' ? 'منذ ' + m + ' ' + units.m : m + units.m;
  const h = Math.floor(m / 60); if (h < 24) return state.lang === 'ar' ? 'منذ ' + h + ' ' + units.h : h + units.h;
  const d = Math.floor(h / 24); if (d < 30) return state.lang === 'ar' ? 'منذ ' + d + ' ' + units.d : d + units.d;
  const mo = Math.floor(d / 30); if (mo < 12) return state.lang === 'ar' ? 'منذ ' + mo + ' ' + units.mo : mo + units.mo;
  const y = Math.floor(mo / 12);
  return state.lang === 'ar' ? 'منذ ' + y + ' ' + units.y : y + units.y;
}
function fmtAbsolute(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}
function safeHref(url) {
  return (typeof url === 'string' && /^https?:\/\//i.test(url)) ? url : null;
}
function hasRtlText(text) {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text || '');
}
function localizeFeedError(message) {
  if (state.lang !== 'ar' || typeof message !== 'string') return message;
  if (message === i18n.en.urlRequired) return t('urlRequired');
  if (message === i18n.en.duplicateFeed) return t('duplicateFeed');
  if (message.startsWith('Not a valid RSS/Atom feed:')) return t('invalidFeed');
  return message || t('couldNotAddFeed');
}
function countFor(feedId) { return state.articles.filter(a => a.sourceFeedId === feedId).length; }
function feedById(feedId) { return state.feeds.find(f => f.id === feedId); }
function keyOf(a) { return a.link || ((a.sourceFeedId || a.sourceFeedUrl || '') + '|' + (a.title || '')); }

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
  if (btn) {
    btn.textContent = state.theme === 'dark' ? '☀' : '☾';
    btn.title = state.theme === 'dark' ? t('themeLight') : t('themeDark');
  }
  try { localStorage.setItem('rss-theme', state.theme); } catch { /* ignore */ }
}

function applyLanguage(lang, rerender) {
  state.lang = lang === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  document.title = state.lang === 'ar' ? 'قارئ الخلاصات' : 'Feed Reader';

  const brand = document.querySelector('.brand-name');
  if (brand) brand.textContent = state.lang === 'ar' ? 'قارئ الخلاصات' : 'Feed Reader';

  const feedInput = document.getElementById('feed-url');
  if (feedInput) feedInput.placeholder = t('addFeedUrl');

  const addError = document.getElementById('add-error');
  if (addError) {
    addError.textContent = '';
    addError.hidden = true;
  }

  const addBtn = document.getElementById('add-submit');
  if (addBtn) addBtn.textContent = t('add');

  const refreshBtn = document.getElementById('refresh-all');
  if (refreshBtn && !refreshBtn.disabled) refreshBtn.textContent = '⟳ ' + t('refreshAll');

  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.placeholder = t('search');

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent = t('langToggle');
    langBtn.title = t('switchLanguage');
  }

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.setAttribute('aria-label', t('close'));

  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) scrollBtn.setAttribute('aria-label', t('backToTop'));

  const scrollLabel = document.querySelector('.scroll-top-label');
  if (scrollLabel) scrollLabel.textContent = t('backToTop');

  const loadingState = document.querySelector('#cards .state');
  if (loadingState && loadingState.textContent.trim().toLowerCase().startsWith('loading')) {
    loadingState.textContent = t('loading');
  }

  applyTheme(state.theme);
  try { localStorage.setItem('rss-lang', state.lang); } catch { /* ignore */ }

  if (rerender) {
    renderSidebar();
    renderCards();
  }
}

// ---------- loading skeleton ----------
function renderSkeleton(n) {
  n = n || 6;
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
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
  if (state.selected !== 'all' && !feedById(state.selected)) state.selected = 'all';
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
  const toggle = document.getElementById('feed-toggle');
  const label = document.getElementById('feed-toggle-label');
  const icon = document.getElementById('feed-toggle-icon');

  label.textContent = t('feeds') + ' (' + state.feeds.length + ')';
  icon.textContent = state.feedsCollapsed ? '+' : '-';
  toggle.setAttribute('aria-expanded', String(!state.feedsCollapsed));
  nav.classList.toggle('collapsed', state.feedsCollapsed);

  nav.innerHTML = '';
  nav.appendChild(navItem('all', t('allFeeds'), state.articles.length, null));
  for (const feed of state.feeds) {
    nav.appendChild(navItem(feed.id, feed.name, countFor(feed.id), feed));
  }
}

function navItem(key, label, count, feed) {
  const item = document.createElement('div');
  item.className = 'nav-item' + (state.selected === key ? ' active' : '');
  if (hasRtlText(label)) item.classList.add('rtl-feed');

  const name = document.createElement('span');
  name.className = 'nav-name';
  name.dir = 'auto';
  name.textContent = label;
  name.title = feed ? feed.url : t('allFeeds');

  const meta = document.createElement('span');
  meta.className = 'nav-meta';

  // Icons first (appear on hover, to the LEFT of the badge) ...
  if (feed) {
    const refresh = document.createElement('button');
    refresh.className = 'nav-refresh';
    refresh.title = t('refreshFeed');
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
    del.title = t('removeFeed');
    del.textContent = '🗑';
    del.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm(t('removeFeedConfirm').replace('{name}', feed.name))) return;
      await api.deleteFeed(feed.id);
      if (state.selected === feed.id) state.selected = 'all';
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
    renderSidebar();
    renderCards();
  });
  return item;
}

// ---------- filtering / sorting ----------
function filteredArticles() {
  let list = state.selected === 'all'
    ? state.articles
    : state.articles.filter(a => a.sourceFeedId === state.selected);

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
  const feed = state.selected === 'all' ? null : feedById(state.selected);
  const header = document.querySelector('.main-header');
  const viewName = document.getElementById('view-name');
  const isRtlFeed = Boolean(feed && hasRtlText(feed.name));
  const isLtrFeed = Boolean(feed && !hasRtlText(feed.name));
  header.classList.toggle('rtl-feed-view', isRtlFeed);
  header.classList.toggle('ltr-feed-view', isLtrFeed);
  viewName.dir = 'auto';
  viewName.textContent = feed ? feed.name : t('allFeeds');

  const list = filteredArticles();
  const total = list.length;
  document.getElementById('view-count').textContent = '(' + total + ')';

  const cards = document.getElementById('cards');
  cards.innerHTML = '';

  if (state.feeds.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'state';
    empty.textContent = t('noFeeds');
    cards.appendChild(empty);
    return;
  }
  if (total === 0) {
    const empty = document.createElement('p');
    empty.className = 'state';
    empty.textContent = state.search ? t('noArticlesMatch') : t('noArticlesYet');
    cards.appendChild(empty);
    return;
  }

  for (const a of list) cards.appendChild(renderCard(a));
}

function renderCard(a) {
  const card = document.createElement('article');
  card.className = 'card';
  const cardMain = document.createElement('div');
  cardMain.className = 'card-main';
  const isRtlArticle = hasRtlText(a.title || a.sourceFeedName || a.summary);
  cardMain.classList.add(isRtlArticle ? 'rtl-card' : 'ltr-card');
  const cardText = document.createElement('div');
  cardText.className = 'card-text';
  const isNew = state.newKeys.has(keyOf(a));
  if (isNew) card.classList.add('new');

  const showSource = state.fields.source && a.sourceFeedName;
  const showDate = state.fields.date && a.publishedAt;
  if (showSource || showDate) {
    const head = document.createElement('div');
    head.className = 'card-head';
    if (showSource && hasRtlText(a.sourceFeedName)) head.classList.add('rtl-meta');
    if (showSource && !hasRtlText(a.sourceFeedName)) head.classList.add('ltr-meta');
    if (showSource) {
      const src = document.createElement('span');
      src.className = 'card-source';
      src.dir = 'auto';
      src.textContent = a.sourceFeedName;
      head.appendChild(src);
    }
    if (showDate) {
      if (showSource) {
        const separator = document.createElement('span');
        separator.className = 'card-meta-separator';
        separator.textContent = '/';
        head.appendChild(separator);
      }
      const t = document.createElement('span');
      t.className = 'card-time';
      t.textContent = timeAgo(a.publishedAt);
      t.title = fmtAbsolute(a.publishedAt);
      head.appendChild(t);
    }
    cardText.appendChild(head);
  }

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.dir = 'auto';
  title.textContent = a.title || t('untitled');
  if (isNew) {
    const badge = document.createElement('span');
    badge.className = 'new-badge';
    badge.textContent = t('new');
    title.appendChild(badge);
  }
  title.addEventListener('click', () => openArticle(a));
  cardText.appendChild(title);

  if (state.fields.author && a.author) {
    const author = document.createElement('div');
    author.className = 'card-author';
    author.textContent = t('by') + ' ' + a.author;
    cardText.appendChild(author);
  }

  if (state.fields.excerpt && a.summary) {
    const excerpt = document.createElement('p');
    excerpt.className = 'card-excerpt';
    excerpt.dir = 'auto';
    excerpt.textContent = a.summary;
    cardText.appendChild(excerpt);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const expand = document.createElement('button');
  expand.className = 'card-icon';
  expand.title = t('openFullArticle');
  expand.textContent = '↗';
  expand.addEventListener('click', () => openArticle(a));
  actions.appendChild(expand);
  cardText.appendChild(actions);

  const imageUrl = safeHref(a.imageUrl);
  if (imageUrl) {
    const image = document.createElement('img');
    image.className = 'card-image';
    image.src = imageUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => image.remove());
    cardMain.appendChild(image);
  }
  cardMain.appendChild(cardText);
  card.appendChild(cardMain);

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
    link.textContent = a.title || t('untitled');
    title.appendChild(link);
  } else {
    title.textContent = a.title || t('untitled');
  }

  content.append(meta, title);

  if (a.author) {
    const author = document.createElement('div');
    author.className = 'modal-author';
    author.textContent = t('by') + ' ' + a.author;
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
    more.textContent = t('readFullArticle') + ' ↗';
    content.appendChild(more);
  }

  document.getElementById('modal').hidden = false;
}
function closeModal() { document.getElementById('modal').hidden = true; }

// ---------- scroll to top ----------
function updateScrollTopButton() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  const visible = window.scrollY > 300;
  btn.hidden = false;
  btn.setAttribute('aria-hidden', String(!visible));
  btn.classList.toggle('visible', visible);
}

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
    let msg = t('couldNotAddFeed');
    try { msg = await res.json(); } catch { try { msg = await res.text(); } catch { /* ignore */ } }
    errEl.textContent = localizeFeedError((typeof msg === 'string' && msg) ? msg : t('couldNotAddFeed'));
    errEl.hidden = false;
  }
});

document.getElementById('refresh-all').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = '⟳ ' + t('refreshing');
  await api.refreshAll();
  await reloadArticles();
  btn.textContent = '⟳ ' + t('refreshAll');
  btn.disabled = false;
});

document.getElementById('feed-toggle').addEventListener('click', () => {
  state.feedsCollapsed = !state.feedsCollapsed;
  renderSidebar();
});

document.getElementById('search').addEventListener('input', (e) => {
  state.search = e.target.value;
  renderCards();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
});

document.getElementById('lang-toggle').addEventListener('click', () => {
  applyLanguage(state.lang === 'ar' ? 'en' : 'ar', true);
});

document.getElementById('scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', updateScrollTopButton, { passive: true });

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ---------- init ----------
(function init() {
  let theme = 'light';
  let lang = 'en';
  try { theme = localStorage.getItem('rss-theme') || 'light'; } catch { /* ignore */ }
  try { lang = localStorage.getItem('rss-lang') || 'en'; } catch { /* ignore */ }
  applyTheme(theme);
  applyLanguage(lang, false);
  updateScrollTopButton();

  loadAll();
})();
