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
  dailyBrief: (request) => fetch('/daily-brief', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  }),
};

const i18n = {
  en: {
    readTime: '{minutes} min read',
    categorySpotlight: 'Category spotlight',
    closeCategory: 'Close category spotlight',
    collapseBrief: 'Collapse daily brief',
    expandBrief: 'Expand daily brief',
    openFullBrief: 'Open full brief',
    add: 'Add',
    addFeedUrl: 'Add feed URL...',
    allFeeds: 'All Feeds',
    backToTop: 'Head to the top!',
    by: 'by',
    catchMeUp: '✨ Catch Me Up',
    close: 'Close',
    copied: 'Copied!',
    copySummary: 'Copy Summary',
    couldNotAddFeed: 'Could not add feed.',
    feeds: 'Feeds',
    generatedAt: 'Generated at {time}',
    generatedFrom: 'Generated from {articles} articles across {feeds} feeds',
    generatingBrief: 'Generating your AI Daily Brief...',
    justNow: 'just now',
    langToggle: 'ع',
    loading: 'Loading...',
    new: 'NEW',
    noArticlesMatch: 'No articles match your search.',
    noArticlesYet: 'No articles yet. Try "Refresh all".',
    noArticlesToday: 'No articles were published today.',
    noFeeds: 'No feeds yet. Add one from the sidebar to get started.',
    duplicateFeed: 'This feed is already in your subscriptions.',
    invalidFeed: 'Not a valid RSS/Atom feed.',
    openFullArticle: 'Open full article at source',
    readFullArticle: 'Read full article',
    regenerate: 'Regenerate',
    refreshAll: 'Refresh all',
    refreshFeed: 'Refresh feed',
    refreshing: 'Refreshing...',
    removeFeed: 'Remove feed',
    removeFeedConfirm: 'Remove "{name}"?',
    search: 'Search',
    briefFailed: 'The AI Daily Brief could not be generated. Please try again.',
    briefNotConfigured: 'The AI Daily Brief is not configured yet.',
    briefTitle: '✨ AI Daily Brief',
    retry: 'Retry',
    switchLanguage: 'Switch language',
    themeDark: 'Switch to dark mode',
    themeLight: 'Switch to light mode',
    takesFewSeconds: 'This may take a few seconds.',
    untitled: '(untitled)',
    urlRequired: 'URL is required.',
    units: { m: 'm ago', h: 'h ago', d: 'd ago', mo: 'mo ago', y: 'y ago' },
  },
  ar: {
    readTime: '\u0642\u0631\u0627\u0621\u0629 {minutes} \u062f',
    categorySpotlight: '\u0646\u0638\u0631\u0629 \u0645\u0631\u0643\u0632\u0629',
    closeCategory: '\u0625\u063a\u0644\u0627\u0642 \u0646\u0638\u0631\u0629 \u0627\u0644\u0641\u0626\u0629',
    collapseBrief: '\u0637\u064a \u0627\u0644\u0645\u0648\u062c\u0632 \u0627\u0644\u064a\u0648\u0645\u064a',
    expandBrief: '\u062a\u0648\u0633\u064a\u0639 \u0627\u0644\u0645\u0648\u062c\u0632 \u0627\u0644\u064a\u0648\u0645\u064a',
    openFullBrief: '\u0641\u062a\u062d \u0627\u0644\u0645\u0648\u062c\u0632 \u0643\u0627\u0645\u0644\u064b\u0627',
    add: 'إضافة',
    addFeedUrl: 'أضف رابط الخلاصة...',
    allFeeds: 'كل الخلاصات',
    backToTop: 'العودة للأعلى',
    by: 'بواسطة',
    catchMeUp: '✨ ألحقني بالأخبار',
    close: 'إغلاق',
    copied: 'تم النسخ!',
    copySummary: 'نسخ الملخص',
    couldNotAddFeed: 'تعذر إضافة الخلاصة.',
    feeds: 'الخلاصات',
    generatedAt: 'تم الإنشاء في {time}',
    generatedFrom: 'تم إنشاؤه من {articles} مقالًا عبر {feeds} خلاصات',
    generatingBrief: 'جارٍ إنشاء موجزك اليومي بالذكاء الاصطناعي...',
    justNow: 'الآن',
    langToggle: 'EN',
    loading: 'جار التحميل...',
    new: 'جديد',
    noArticlesMatch: 'لا توجد مقالات تطابق البحث.',
    noArticlesYet: 'لا توجد مقالات بعد. جرّب "تحديث الكل".',
    noArticlesToday: 'لم تُنشر أي مقالات اليوم.',
    noFeeds: 'لا توجد خلاصات بعد. أضف واحدة من الشريط الجانبي للبدء.',
    duplicateFeed: 'هذه الخلاصة موجودة بالفعل في اشتراكاتك.',
    invalidFeed: 'هذا الرابط ليس خلاصة RSS/Atom صالحة.',
    openFullArticle: 'فتح المقالة كاملة من المصدر',
    readFullArticle: 'قراءة المقالة كاملة',
    regenerate: 'إعادة الإنشاء',
    refreshAll: 'تحديث الكل',
    refreshFeed: 'تحديث الخلاصة',
    refreshing: 'جار التحديث...',
    removeFeed: 'حذف الخلاصة',
    removeFeedConfirm: 'حذف "{name}"؟',
    search: 'بحث',
    briefFailed: 'تعذر إنشاء الموجز اليومي. يُرجى المحاولة مرة أخرى.',
    briefNotConfigured: 'لم يتم إعداد الموجز اليومي بعد.',
    briefTitle: '✨ الموجز اليومي بالذكاء الاصطناعي',
    retry: 'إعادة المحاولة',
    switchLanguage: 'تغيير اللغة',
    themeDark: 'التبديل إلى الوضع الداكن',
    themeLight: 'التبديل إلى الوضع الفاتح',
    takesFewSeconds: 'قد يستغرق هذا بضع ثوانٍ.',
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
  dailyBrief: {
    status: 'idle',
    data: null,
    error: '',
    collapsed: false,
    spotlightSection: null,
    language: null,
  },
};

// ---------- helpers ----------
function t(key) {
  return i18n[state.lang][key] || i18n.en[key] || key;
}

function tf(key, values) {
  return Object.entries(values).reduce(
    (text, entry) => text.replace('{' + entry[0] + '}', entry[1]),
    t(key)
  );
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
  const nextLanguage = lang === 'ar' ? 'ar' : 'en';
  if (state.dailyBrief.language && state.dailyBrief.language !== nextLanguage) {
    resetDailyBrief();
  }
  state.lang = nextLanguage;
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

  const catchUpBtn = document.getElementById('catch-me-up');
  if (catchUpBtn) catchUpBtn.textContent = t('catchMeUp');

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
  updateDailyBriefButton();
  try { localStorage.setItem('rss-lang', state.lang); } catch { /* ignore */ }

  if (rerender) {
    renderSidebar();
    renderCards();
  }
}

// ---------- AI daily brief ----------
function resetDailyBrief() {
  state.dailyBrief.status = 'idle';
  state.dailyBrief.data = null;
  state.dailyBrief.error = '';
  state.dailyBrief.collapsed = false;
  state.dailyBrief.spotlightSection = null;
  state.dailyBrief.language = null;
}

function updateDailyBriefButton() {
  const button = document.getElementById('catch-me-up');
  if (!button) return;
  button.disabled = state.dailyBrief.status === 'loading';
  button.textContent = t('catchMeUp');
}

function todayUtcRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { dayStartUtc: start.toISOString(), dayEndUtc: end.toISOString() };
}

function scrollToDailyBrief() {
  requestAnimationFrame(() => {
    const card = document.getElementById('daily-brief-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

async function generateDailyBrief(regenerate) {
  const brief = state.dailyBrief;
  if (!regenerate && brief.data && brief.language === state.lang) {
    brief.collapsed = false;
    brief.spotlightSection = null;
    brief.status = 'success';
    renderCards();
    scrollToDailyBrief();
    return;
  }

  if (brief.status === 'loading') {
    scrollToDailyBrief();
    return;
  }

  const requestLanguage = state.lang;
  brief.status = 'loading';
  brief.data = null;
  brief.error = '';
  brief.collapsed = false;
  brief.spotlightSection = null;
  brief.language = requestLanguage;
  updateDailyBriefButton();
  renderCards();
  scrollToDailyBrief();

  try {
    const response = await api.dailyBrief({
      ...todayUtcRange(),
      language: requestLanguage,
      regenerate: Boolean(regenerate)
    });

    let payload = null;
    try { payload = await response.json(); } catch { /* handled below */ }

    if (!response.ok) {
      let message = t('briefFailed');
      if (response.status === 404) message = t('noArticlesToday');
      else if (response.status === 503) message = t('briefNotConfigured');
      else if (requestLanguage === 'en' && payload && payload.error) message = payload.error;
      throw new Error(message);
    }

    if (state.lang !== requestLanguage) return;
    brief.data = payload;
    brief.status = 'success';
  } catch (error) {
    if (state.lang !== requestLanguage) return;
    brief.error = error instanceof Error ? error.message : t('briefFailed');
    brief.status = 'error';
  } finally {
    if (state.lang === requestLanguage) {
      updateDailyBriefButton();
      renderCards();
      scrollToDailyBrief();
    }
  }
}

function briefAsText(brief) {
  const parts = [t('briefTitle'), '', brief.introduction];
  for (const section of brief.sections || []) {
    parts.push('', section.title);
    for (const bullet of section.bullets || []) parts.push('• ' + bullet);
  }
  return parts.join('\n');
}

function dailyBriefReadingMinutes(brief) {
  const text = [
    brief.introduction || '',
    ...(brief.sections || []).flatMap(section => [
      section.title || '',
      ...(section.bullets || [])
    ])
  ].join(' ').trim();
  const words = text ? text.split(/\s+/u).length : 0;
  return Math.max(1, Math.ceil(words / 220));
}

async function copyDailyBrief(button) {
  const text = briefAsText(state.dailyBrief.data);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
  button.textContent = t('copied');
  window.setTimeout(() => { button.textContent = t('copySummary'); }, 1400);
}

function renderDailyBriefCard() {
  const briefState = state.dailyBrief;
  const card = document.createElement('article');
  card.id = 'daily-brief-card';
  card.className = 'card daily-brief-card daily-brief-' + briefState.status;
  card.setAttribute('aria-live', briefState.status === 'loading' ? 'polite' : 'assertive');

  if (briefState.status === 'loading') {
    const loading = document.createElement('div');
    loading.className = 'daily-brief-state';
    const spinner = document.createElement('span');
    spinner.className = 'daily-brief-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    const text = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = t('generatingBrief');
    const detail = document.createElement('p');
    detail.textContent = t('takesFewSeconds');
    text.append(title, detail);
    loading.append(spinner, text);
    card.appendChild(loading);
    return card;
  }

  if (briefState.status === 'error') {
    const errorState = document.createElement('div');
    errorState.className = 'daily-brief-state daily-brief-error-content';
    const text = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = t('briefTitle');
    const detail = document.createElement('p');
    detail.textContent = briefState.error || t('briefFailed');
    text.append(title, detail);
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'daily-brief-action primary';
    retry.textContent = t('retry');
    retry.addEventListener('click', () => generateDailyBrief(false));
    errorState.append(text, retry);
    card.appendChild(errorState);
    return card;
  }

  const brief = briefState.data;

  if (briefState.collapsed) {
    card.classList.add('daily-brief-collapsed');
    card.removeAttribute('aria-live');

    const ribbon = document.createElement('div');
    ribbon.className = 'daily-brief-ribbon';

    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'daily-brief-ribbon-title';
    expand.setAttribute('aria-expanded', 'false');
    expand.setAttribute('aria-label', t('expandBrief'));

    const sparkle = document.createElement('span');
    sparkle.setAttribute('aria-hidden', 'true');
    sparkle.textContent = '\u2728';
    const compactTitle = document.createElement('strong');
    compactTitle.textContent = t('briefTitle').replace(/^\u2728\s*/, '');
    const chevron = document.createElement('span');
    chevron.className = 'daily-brief-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '\u25be';
    expand.append(sparkle, compactTitle, chevron);
    expand.addEventListener('click', () => {
      briefState.collapsed = false;
      briefState.spotlightSection = null;
      renderCards();
      scrollToDailyBrief();
    });

    const categories = document.createElement('div');
    categories.className = 'daily-brief-ribbon-categories';
    for (const [sectionIndex, section] of (brief.sections || []).entries()) {
      const category = document.createElement('button');
      category.type = 'button';
      category.className = 'daily-brief-category';
      const isActive = briefState.spotlightSection === sectionIndex;
      category.classList.toggle('active', isActive);
      category.textContent = section.title;
      category.title = (section.bullets || [])[0] || section.title;
      category.setAttribute('aria-expanded', String(isActive));
      category.setAttribute('aria-controls', 'daily-brief-spotlight');
      category.addEventListener('click', () => {
        briefState.spotlightSection = isActive ? null : sectionIndex;
        renderCards();
      });
      categories.appendChild(category);
    }

    ribbon.append(expand, categories);
    card.appendChild(ribbon);

    const spotlightSection = (brief.sections || [])[briefState.spotlightSection];
    if (spotlightSection) {
      const spotlight = document.createElement('section');
      spotlight.id = 'daily-brief-spotlight';
      spotlight.className = 'daily-brief-spotlight';

      const spotlightHeader = document.createElement('header');
      spotlightHeader.className = 'daily-brief-spotlight-header';
      const spotlightHeading = document.createElement('div');
      const eyebrow = document.createElement('span');
      eyebrow.className = 'daily-brief-spotlight-eyebrow';
      eyebrow.textContent = t('categorySpotlight');
      const sectionTitle = document.createElement('h3');
      sectionTitle.textContent = spotlightSection.title;
      spotlightHeading.append(eyebrow, sectionTitle);

      const closeSpotlight = document.createElement('button');
      closeSpotlight.type = 'button';
      closeSpotlight.className = 'daily-brief-spotlight-close';
      closeSpotlight.setAttribute('aria-label', t('closeCategory'));
      closeSpotlight.textContent = '\u00d7';
      closeSpotlight.addEventListener('click', () => {
        briefState.spotlightSection = null;
        renderCards();
      });
      spotlightHeader.append(spotlightHeading, closeSpotlight);

      const points = document.createElement('ol');
      points.className = 'daily-brief-spotlight-points';
      for (const bullet of spotlightSection.bullets || []) {
        const point = document.createElement('li');
        const pointText = document.createElement('span');
        pointText.textContent = bullet;
        point.appendChild(pointText);
        points.appendChild(point);
      }

      const openFull = document.createElement('button');
      openFull.type = 'button';
      openFull.className = 'daily-brief-spotlight-open';
      openFull.textContent = t('openFullBrief') + ' \u2192';
      openFull.addEventListener('click', () => {
        briefState.collapsed = false;
        briefState.spotlightSection = null;
        renderCards();
        scrollToDailyBrief();
      });

      spotlight.append(spotlightHeader, points, openFull);
      card.appendChild(spotlight);
    }
    return card;
  }

  const header = document.createElement('header');
  header.className = 'daily-brief-header';
  const headingGroup = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = t('briefTitle');
  const subtitle = document.createElement('p');
  subtitle.textContent = tf('generatedFrom', {
    articles: brief.articleCount,
    feeds: brief.feedCount
  });
  const readTime = document.createElement('span');
  readTime.className = 'daily-brief-read-time';
  readTime.textContent = tf('readTime', {
    minutes: dailyBriefReadingMinutes(brief)
  });
  const headerDetails = document.createElement('div');
  headerDetails.className = 'daily-brief-header-details';
  headerDetails.append(subtitle, readTime);
  headingGroup.append(title, headerDetails);
  const collapse = document.createElement('button');
  collapse.type = 'button';
  collapse.className = 'daily-brief-close';
  collapse.setAttribute('aria-label', t('collapseBrief'));
  collapse.setAttribute('aria-expanded', 'true');
  collapse.textContent = '\u2212';
  collapse.addEventListener('click', () => {
    briefState.collapsed = true;
    briefState.spotlightSection = null;
    renderCards();
  });
  header.append(headingGroup, collapse);

  const body = document.createElement('div');
  body.className = 'daily-brief-body';
  const introduction = document.createElement('p');
  introduction.className = 'daily-brief-introduction';
  introduction.textContent = brief.introduction;
  body.appendChild(introduction);
  for (const section of brief.sections || []) {
    const sectionElement = document.createElement('section');
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = section.title;
    const bullets = document.createElement('ul');
    for (const bullet of section.bullets || []) {
      const item = document.createElement('li');
      item.textContent = bullet;
      bullets.appendChild(item);
    }
    sectionElement.append(sectionTitle, bullets);
    body.appendChild(sectionElement);
  }

  const footer = document.createElement('footer');
  footer.className = 'daily-brief-footer';
  const generatedAt = document.createElement('span');
  const time = new Date(brief.generatedAt).toLocaleTimeString(
    state.lang === 'ar' ? 'ar-EG' : undefined,
    { hour: '2-digit', minute: '2-digit' }
  );
  generatedAt.textContent = tf('generatedAt', { time });
  const actions = document.createElement('div');
  actions.className = 'daily-brief-actions';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'daily-brief-action';
  copy.textContent = t('copySummary');
  copy.addEventListener('click', () => copyDailyBrief(copy));
  const regenerate = document.createElement('button');
  regenerate.type = 'button';
  regenerate.className = 'daily-brief-action primary';
  regenerate.textContent = t('regenerate');
  regenerate.addEventListener('click', () => generateDailyBrief(true));
  actions.append(copy, regenerate);
  footer.append(generatedAt, actions);

  card.append(header, body, footer);
  return card;
}

// ---------- loading skeleton ----------
function renderSkeleton(n) {
  n = n || 6;
  const cards = document.getElementById('cards');
  cards.innerHTML = '';

  if (state.dailyBrief.status !== 'idle') {
    cards.appendChild(renderDailyBriefCard());
  }
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

  if (state.dailyBrief.status !== 'idle') {
    cards.appendChild(renderDailyBriefCard());
  }

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

document.getElementById('catch-me-up').addEventListener('click', () => {
  generateDailyBrief(false);
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
