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
    catchMeUp: 'Catch Me Up',
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
    noArticlesInFeed: 'No articles yet. Try refreshing this feed.',
    noArticlesToday: 'No articles were published today.',
    noFeeds: 'No feeds yet. Open Manage Feeds to add your first subscription.',
    duplicateFeed: 'This feed is already in your subscriptions.',
    invalidFeed: 'Not a valid RSS/Atom feed.',
    openFullArticle: 'Open full article at source',
    readFullArticle: 'Read full article',
    regenerate: 'Regenerate',
    refreshAll: 'Refresh all',
    refreshFeed: 'Refresh this feed',
    refreshingAll: 'Refreshing all...',
    refreshingFeed: 'Refreshing feed...',
    refreshing: 'Refreshing...',
    removeFeed: 'Remove feed',
    removeFeedConfirm: 'Remove "{name}"?',
    search: 'Search',
    briefFailed: 'The AI Daily Brief could not be generated. Please try again.',
    briefNotConfigured: 'The AI Daily Brief is not configured yet.',
    briefTitle: 'AI Daily Brief',
    briefDisplayTitle: 'Daily Brief',
    briefCooldown: 'Please wait at least one minute between regenerations.',
    briefDailyLimit: 'You have used all 5 brief regenerations for today.',
    briefGlobalLimit: 'The AI Daily Brief has reached its generation limit for today.',
    briefQuota: 'You have {remaining} regenerations today.',
    briefQuotaOne: 'You have 1 regeneration today.',
    retry: 'Retry',
    switchLanguage: 'Switch language',
    sourceLinks: 'Contributing sources',
    sources: '{count} sources',
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
    catchMeUp: 'ألحقني بالأخبار',
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
    noArticlesInFeed: 'لا توجد مقالات بعد. جرّب تحديث هذه الخلاصة.',
    noArticlesToday: 'لم تُنشر أي مقالات اليوم.',
    noFeeds: 'لا توجد خلاصات بعد. افتح إدارة الخلاصات لإضافة اشتراكك الأول.',
    duplicateFeed: 'هذه الخلاصة موجودة بالفعل في اشتراكاتك.',
    invalidFeed: 'هذا الرابط ليس خلاصة RSS/Atom صالحة.',
    openFullArticle: 'فتح المقالة كاملة من المصدر',
    readFullArticle: 'قراءة المقالة كاملة',
    regenerate: 'إعادة الإنشاء',
    refreshAll: 'تحديث الكل',
    refreshFeed: 'تحديث هذه الخلاصة',
    refreshingAll: 'جارٍ تحديث الكل...',
    refreshingFeed: 'جارٍ تحديث الخلاصة...',
    refreshing: 'جار التحديث...',
    removeFeed: 'حذف الخلاصة',
    removeFeedConfirm: 'حذف "{name}"؟',
    search: 'بحث',
    briefFailed: 'تعذر إنشاء الموجز اليومي. يُرجى المحاولة مرة أخرى.',
    briefNotConfigured: 'لم يتم إعداد الموجز اليومي بعد.',
    briefTitle: 'الموجز اليومي بالذكاء الاصطناعي',
    briefDisplayTitle: 'الموجز اليومي',
    briefCooldown: 'يُرجى الانتظار دقيقة واحدة على الأقل بين مرات إعادة الإنشاء.',
    briefDailyLimit: 'لقد استخدمت محاولات إعادة الإنشاء الخمس المتاحة اليوم.',
    briefGlobalLimit: 'وصل الموجز اليومي إلى الحد الإجمالي للإنشاء اليوم.',
    briefQuota: 'لديك {remaining} مرات إعادة إنشاء اليوم.',
    briefQuotaOne: 'لديك إعادة إنشاء واحدة اليوم.',
    retry: 'إعادة المحاولة',
    switchLanguage: 'تغيير اللغة',
    sourceLinks: 'المصادر المساهمة',
    sources: '{count} مصادر',
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
    sourceSection: null,
    language: null,
    remainingRegenerations: null,
    dailyRegenerationLimit: 5,
    regenerateAvailableAt: 0,
    limitReason: null,
    notice: '',
  },
};

let recentFeedIds = [];
try {
  recentFeedIds = JSON.parse(localStorage.getItem('rss-recent-feeds') || '[]');
  if (!Array.isArray(recentFeedIds)) recentFeedIds = [];
} catch { recentFeedIds = []; }

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
function createAiBadge() {
  const badge = document.createElement('span');
  badge.className = 'ai-badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.textContent = 'AI';
  return badge;
}
function setAiLabel(element, label) {
  element.classList.add('icon-label');
  element.replaceChildren(createAiBadge(), document.createTextNode(label));
}
function createSourceButton(section, sectionIndex, expanded) {
  const sources = section.sources || [];
  if (!sources.length) return null;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'daily-brief-source-button';
  button.title = tf('sources', { count: sources.length });
  button.setAttribute('aria-label', button.title);
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-controls', `daily-brief-sources-${sectionIndex}`);
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  const count = document.createElement('span');
  count.textContent = sources.length;
  button.appendChild(count);
  return button;
}
function createSourcesPanel(section, sectionIndex) {
  const panel = document.createElement('div');
  panel.id = `daily-brief-sources-${sectionIndex}`;
  panel.className = 'daily-brief-sources-panel';
  panel.setAttribute('aria-label', t('sourceLinks'));
  const list = document.createElement('ul');
  for (const source of section.sources || []) {
    const href = safeHref(source.url);
    if (!href) continue;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const publication = document.createElement('span');
    publication.className = 'daily-brief-source-publication';
    publication.textContent = source.sourceName || t('sourceLinks');
    const title = document.createElement('span');
    title.className = 'daily-brief-source-title';
    title.textContent = source.title || source.sourceName || href;
    link.append(publication, title);
    item.appendChild(link);
    list.appendChild(item);
  }
  panel.appendChild(list);
  return panel;
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
  for (const id of ['theme-toggle', 'mobile-theme-toggle']) {
    const btn = document.getElementById(id);
    if (!btn) continue;
    if (id === 'theme-toggle') btn.textContent = state.theme === 'dark' ? '☀' : '☾';
    btn.title = state.theme === 'dark' ? t('themeLight') : t('themeDark');
  }
  const mobileThemeValue = document.getElementById('mobile-theme-value');
  if (mobileThemeValue) {
    mobileThemeValue.textContent = state.lang === 'ar'
      ? (state.theme === 'dark' ? 'التبديل إلى الفاتح' : 'التبديل إلى الداكن')
      : (state.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark');
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

  document.querySelectorAll('.brand-name, .mobile-brand-name').forEach(brand => {
    brand.textContent = state.lang === 'ar' ? 'قارئ الخلاصات' : 'Feed Reader';
  });

  const sidebarFeedSearch = document.getElementById('sidebar-feed-search');
  if (sidebarFeedSearch) sidebarFeedSearch.placeholder = state.lang === 'ar' ? 'ابحث عن خلاصة' : 'Find a feed';
  const sidebarManageFeeds = document.getElementById('sidebar-manage-feeds');
  if (sidebarManageFeeds) sidebarManageFeeds.textContent = state.lang === 'ar' ? 'إدارة كل الخلاصات ←' : 'Manage all feeds →';

  const addError = document.getElementById('add-error');
  if (addError) {
    addError.textContent = '';
    addError.hidden = true;
  }

  const refreshBtn = document.getElementById('refresh-all');
  if (refreshBtn && !refreshBtn.disabled) updateSidebarRefreshLabel();

  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.placeholder = t('search');
  const mobileSearchInput = document.getElementById('mobile-search');
  if (mobileSearchInput) mobileSearchInput.placeholder = t('search');
  const mobileSearchToggle = document.getElementById('mobile-search-toggle');
  if (mobileSearchToggle) mobileSearchToggle.setAttribute('aria-label', t('search'));
  const mobileFeedsLink = document.getElementById('mobile-feeds-link');
  if (mobileFeedsLink) mobileFeedsLink.textContent = t('feeds');
  const mobileFeedSearch = document.getElementById('mobile-feed-search');
  if (mobileFeedSearch) mobileFeedSearch.placeholder = state.lang === 'ar' ? 'ابحث عن خلاصة' : 'Find a feed';
  const mobileManageFeeds = document.getElementById('mobile-manage-feeds');
  if (mobileManageFeeds) mobileManageFeeds.textContent = state.lang === 'ar' ? 'إدارة كل الخلاصات ←' : 'Manage all feeds →';
  const managerTitle = document.getElementById('feed-manager-title');
  if (managerTitle) managerTitle.textContent = state.lang === 'ar' ? 'إدارة الخلاصات' : 'Manage Feeds';
  const managerSubtitle = document.getElementById('feed-manager-subtitle');
  if (managerSubtitle) managerSubtitle.textContent = state.lang === 'ar' ? 'أضف اشتراكاتك أو ابحث عنها أو احذفها.' : 'Add, find, or remove your subscriptions.';
  const managerBack = document.getElementById('feed-manager-back');
  if (managerBack) managerBack.textContent = state.lang === 'ar' ? 'رجوع →' : '← Back';
  const managerUrl = document.getElementById('feed-manager-url');
  if (managerUrl) managerUrl.placeholder = t('addFeedUrl');
  const managerAdd = document.getElementById('feed-manager-add-button');
  if (managerAdd) managerAdd.setAttribute('aria-label', state.lang === 'ar' ? 'أضف الخلاصة' : 'Add feed');
  const managerSearch = document.getElementById('feed-manager-search');
  if (managerSearch) managerSearch.placeholder = state.lang === 'ar' ? 'ابحث في كل الخلاصات' : 'Search all feeds';
  const mobileHome = document.getElementById('mobile-home');
  if (mobileHome) mobileHome.setAttribute('aria-label', state.lang === 'ar' ? 'الرئيسية' : 'Home');
  const mobileMenuRows = document.querySelectorAll('.mobile-menu-row > span:first-child');
  if (mobileMenuRows[0]) mobileMenuRows[0].textContent = state.lang === 'ar' ? 'اللغة' : 'Language';
  if (mobileMenuRows[1]) mobileMenuRows[1].textContent = state.lang === 'ar' ? 'المظهر' : 'Appearance';

  for (const id of ['catch-me-up', 'mobile-catch-me-up']) {
    const catchUpBtn = document.getElementById(id);
    if (catchUpBtn) setAiLabel(catchUpBtn, t('catchMeUp'));
  }

  for (const id of ['lang-toggle', 'mobile-lang-toggle']) {
    const langBtn = document.getElementById(id);
    if (!langBtn) continue;
    if (id === 'lang-toggle') langBtn.textContent = t('langToggle');
    langBtn.title = t('switchLanguage');
  }
  const mobileLanguageValue = document.getElementById('mobile-language-value');
  if (mobileLanguageValue) mobileLanguageValue.textContent = state.lang === 'ar' ? 'التبديل إلى English' : 'Switch to العربية';
  const mobileThemeValue = document.getElementById('mobile-theme-value');
  if (mobileThemeValue) {
    mobileThemeValue.textContent = state.lang === 'ar'
      ? (state.theme === 'dark' ? 'التبديل إلى الفاتح' : 'التبديل إلى الداكن')
      : (state.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark');
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
    if (window.location.pathname === '/manage-feeds') renderFeedManager();
  }
}

// ---------- AI daily brief ----------
function resetDailyBrief() {
  state.dailyBrief.status = 'idle';
  state.dailyBrief.data = null;
  state.dailyBrief.error = '';
  state.dailyBrief.collapsed = false;
  state.dailyBrief.spotlightSection = null;
  state.dailyBrief.sourceSection = null;
  state.dailyBrief.language = null;
  state.dailyBrief.notice = '';
}

function updateDailyBriefButton() {
  for (const id of ['catch-me-up', 'mobile-catch-me-up']) {
    const button = document.getElementById(id);
    if (!button) continue;
    button.disabled = state.dailyBrief.status === 'loading';
    setAiLabel(button, t('catchMeUp'));
  }
}

function updateDailyBriefQuota(response, payload) {
  const remainingHeader = response.headers.get('X-AI-Regenerations-Remaining');
  const limitHeader = response.headers.get('X-AI-Regenerations-Limit');
  const remaining = remainingHeader ?? (payload && payload.remainingRegenerations);
  const limit = limitHeader ?? (payload && payload.dailyRegenerationLimit);
  const retryAfter = response.headers.get('X-AI-Regenerate-After')
    ?? (payload && payload.retryAfterSeconds);
  const reason = response.headers.get('X-AI-Rate-Limit-Reason')
    ?? (payload && payload.reason);

  if (remaining !== null && remaining !== undefined && !Number.isNaN(Number(remaining))) {
    state.dailyBrief.remainingRegenerations = Number(remaining);
  }
  if (limit !== null && limit !== undefined && !Number.isNaN(Number(limit))) {
    state.dailyBrief.dailyRegenerationLimit = Number(limit);
  }
  if (retryAfter !== null && retryAfter !== undefined && Number(retryAfter) > 0) {
    state.dailyBrief.regenerateAvailableAt = Date.now() + (Number(retryAfter) * 1000);
  } else {
    state.dailyBrief.regenerateAvailableAt = 0;
  }
  state.dailyBrief.limitReason = reason && reason !== 'None'
    ? reason
    : (Number(retryAfter) > 0 ? 'Cooldown' : null);
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
  if (regenerate && brief.data) {
    if (brief.remainingRegenerations === 0) {
      brief.notice = t('briefDailyLimit');
      renderCards();
      return;
    }
    if (brief.limitReason === 'GlobalDailyLimit') {
      brief.notice = t('briefGlobalLimit');
      renderCards();
      return;
    }
    if (brief.regenerateAvailableAt > Date.now()) {
      brief.notice = t('briefCooldown');
      renderCards();
      return;
    }
  }

  if (!regenerate && brief.data && brief.language === state.lang) {
    brief.collapsed = false;
    brief.spotlightSection = null;
    brief.sourceSection = null;
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
  const previousData = brief.data;
  brief.status = 'loading';
  brief.data = null;
  brief.error = '';
  brief.notice = '';
  brief.collapsed = false;
  brief.spotlightSection = null;
  brief.sourceSection = null;
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
    updateDailyBriefQuota(response, payload);

    if (!response.ok) {
      let message = t('briefFailed');
      if (response.status === 404) message = t('noArticlesToday');
      else if (response.status === 503) message = t('briefNotConfigured');
      else if (response.status === 429 && payload) {
        if (payload.reason === 'Cooldown') {
          message = t('briefCooldown');
        } else if (payload.reason === 'DailyIpLimit') {
          message = t('briefDailyLimit');
        } else if (payload.reason === 'GlobalDailyLimit') {
          message = t('briefGlobalLimit');
        }
      }
      else if (requestLanguage === 'en' && payload && payload.error) message = payload.error;
      if (response.status === 429 && previousData) {
        brief.data = previousData;
        brief.status = 'success';
        brief.notice = message;
        return;
      }
      throw new Error(message);
    }

    if (state.lang !== requestLanguage) return;
    brief.data = payload;
    brief.status = 'success';
    brief.notice = '';
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
    setAiLabel(title, t('briefDisplayTitle'));
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

    const aiBadge = createAiBadge();
    const compactTitle = document.createElement('strong');
    compactTitle.textContent = t('briefDisplayTitle');
    const chevron = document.createElement('span');
    chevron.className = 'daily-brief-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '\u25be';
    expand.append(aiBadge, compactTitle, chevron);
    expand.addEventListener('click', () => {
      briefState.collapsed = false;
      briefState.spotlightSection = null;
      briefState.sourceSection = null;
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
        briefState.sourceSection = null;
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
      const spotlightTitleRow = document.createElement('div');
      spotlightTitleRow.className = 'daily-brief-spotlight-title-row';
      spotlightTitleRow.appendChild(sectionTitle);
      const sourcesExpanded = briefState.sourceSection === briefState.spotlightSection;
      const sourceButton = createSourceButton(
        spotlightSection,
        briefState.spotlightSection,
        sourcesExpanded);
      if (sourceButton) {
        sourceButton.addEventListener('click', () => {
          briefState.sourceSection = sourcesExpanded ? null : briefState.spotlightSection;
          renderCards();
        });
        spotlightTitleRow.appendChild(sourceButton);
      }
      spotlightHeading.append(eyebrow, spotlightTitleRow);

      const closeSpotlight = document.createElement('button');
      closeSpotlight.type = 'button';
      closeSpotlight.className = 'daily-brief-spotlight-close';
      closeSpotlight.setAttribute('aria-label', t('closeCategory'));
      closeSpotlight.textContent = '\u00d7';
      closeSpotlight.addEventListener('click', () => {
        briefState.spotlightSection = null;
        briefState.sourceSection = null;
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
        briefState.sourceSection = null;
        renderCards();
        scrollToDailyBrief();
      });

      spotlight.append(spotlightHeader, points);
      if (sourcesExpanded) {
        spotlight.appendChild(createSourcesPanel(spotlightSection, briefState.spotlightSection));
      }
      spotlight.appendChild(openFull);
      card.appendChild(spotlight);
    }
    return card;
  }

  const header = document.createElement('header');
  header.className = 'daily-brief-header';
  const headingGroup = document.createElement('div');
  const title = document.createElement('h2');
  setAiLabel(title, t('briefDisplayTitle'));
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
    briefState.sourceSection = null;
    renderCards();
  });
  header.append(headingGroup, collapse);

  const body = document.createElement('div');
  body.className = 'daily-brief-body';
  const introduction = document.createElement('p');
  introduction.className = 'daily-brief-introduction';
  introduction.textContent = brief.introduction;
  body.appendChild(introduction);
  for (const [sectionIndex, section] of (brief.sections || []).entries()) {
    const sectionElement = document.createElement('section');
    const sectionHeading = document.createElement('div');
    sectionHeading.className = 'daily-brief-section-heading';
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = section.title;
    sectionHeading.appendChild(sectionTitle);
    const sourcesExpanded = briefState.sourceSection === sectionIndex;
    const sourceButton = createSourceButton(section, sectionIndex, sourcesExpanded);
    if (sourceButton) {
      sourceButton.addEventListener('click', () => {
        briefState.sourceSection = sourcesExpanded ? null : sectionIndex;
        renderCards();
      });
      sectionHeading.appendChild(sourceButton);
    }
    const bullets = document.createElement('ul');
    for (const bullet of section.bullets || []) {
      const item = document.createElement('li');
      item.textContent = bullet;
      bullets.appendChild(item);
    }
    sectionElement.append(sectionHeading, bullets);
    if (sourcesExpanded) sectionElement.appendChild(createSourcesPanel(section, sectionIndex));
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
  const quota = document.createElement('span');
  quota.className = 'daily-brief-quota';
  const remainingRegenerations = briefState.remainingRegenerations
    ?? briefState.dailyRegenerationLimit;
  quota.textContent = remainingRegenerations === 1
    ? t('briefQuotaOne')
    : tf('briefQuota', { remaining: remainingRegenerations });
  const regenerate = document.createElement('button');
  regenerate.type = 'button';
  regenerate.className = 'daily-brief-action primary';
  regenerate.textContent = t('regenerate');
  regenerate.disabled = briefState.remainingRegenerations === 0;
  if (regenerate.disabled) regenerate.title = t('briefDailyLimit');
  regenerate.addEventListener('click', () => generateDailyBrief(true));
  actions.append(copy, regenerate);
  const footerMessage = document.createElement('div');
  footerMessage.className = 'daily-brief-footer-message';
  footerMessage.appendChild(quota);
  if (briefState.notice) {
    const notice = document.createElement('span');
    notice.className = 'daily-brief-limit-notice';
    notice.setAttribute('role', 'status');
    notice.textContent = briefState.notice;
    footerMessage.appendChild(notice);
  }
  footer.append(generatedAt, actions, footerMessage);

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
  if (window.location.pathname === '/manage-feeds') renderFeedManager();
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
  const search = document.getElementById('sidebar-feed-search');
  const query = search.value.trim().toLocaleLowerCase();
  const recent = recentFeedIds.map(feedById).filter(Boolean);
  const ordered = [...recent, ...state.feeds.filter(feed => !recentFeedIds.includes(feed.id))];
  const visible = (query
    ? ordered.filter(feed => feed.name.toLocaleLowerCase().includes(query))
    : ordered
  ).slice(0, query ? 10 : 6);

  nav.innerHTML = '';
  nav.appendChild(navItem('all', t('allFeeds'), state.articles.length, null));
  if (visible.length) {
    const sectionLabel = document.createElement('p');
    sectionLabel.className = 'sidebar-feed-label';
    sectionLabel.textContent = query
      ? (state.lang === 'ar' ? 'نتائج البحث' : 'Search results')
      : (state.lang === 'ar' ? 'الخلاصات الأخيرة' : 'Recent feeds');
    nav.appendChild(sectionLabel);
  }
  for (const feed of visible) nav.appendChild(navItem(feed.id, feed.name, countFor(feed.id), feed));
  if (query && !visible.length) {
    const empty = document.createElement('p');
    empty.className = 'sidebar-feed-label';
    empty.textContent = state.lang === 'ar' ? 'لا توجد خلاصات مطابقة' : 'No matching feeds';
    nav.appendChild(empty);
  }
  updateSidebarRefreshLabel();
  renderQuickFeeds();
}

function updateSidebarRefreshLabel() {
  const button = document.getElementById('refresh-all');
  if (!button || button.disabled) return;
  button.textContent = '⟳ ' + t(state.selected === 'all' ? 'refreshAll' : 'refreshFeed');
}

function rememberFeed(key) {
  if (key === 'all') return;
  recentFeedIds = [key, ...recentFeedIds.filter(id => id !== key)].slice(0, 8);
  try { localStorage.setItem('rss-recent-feeds', JSON.stringify(recentFeedIds)); } catch { /* ignore */ }
}

function renderQuickFeeds() {
  const list = document.getElementById('mobile-quick-feeds');
  const search = document.getElementById('mobile-feed-search');
  if (!list || !search) return;
  const query = search.value.trim().toLocaleLowerCase();
  const recent = recentFeedIds.map(feedById).filter(Boolean);
  const ordered = [...recent, ...state.feeds.filter(feed => !recentFeedIds.includes(feed.id))];
  const visible = (query
    ? ordered.filter(feed => feed.name.toLocaleLowerCase().includes(query))
    : ordered
  ).slice(0, query ? 8 : 5);

  list.innerHTML = '';
  if (!query || t('allFeeds').toLocaleLowerCase().includes(query)) {
    list.appendChild(quickFeedButton('all', t('allFeeds'), state.articles.length));
  }
  if (visible.length) {
    const label = document.createElement('p');
    label.className = 'mobile-quick-feeds-label';
    label.textContent = query
      ? (state.lang === 'ar' ? 'نتائج البحث' : 'Search results')
      : (state.lang === 'ar' ? 'الخلاصات الأخيرة' : 'Recent feeds');
    list.appendChild(label);
  }
  for (const feed of visible) list.appendChild(quickFeedButton(feed.id, feed.name, countFor(feed.id)));
  if (!list.children.length) {
    const empty = document.createElement('p');
    empty.className = 'state';
    empty.textContent = state.lang === 'ar' ? 'لا توجد خلاصات مطابقة.' : 'No matching feeds.';
    list.appendChild(empty);
  }
}

function quickFeedButton(key, label, count) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mobile-quick-feed' + (state.selected === key ? ' active' : '');
  const name = document.createElement('span');
  name.className = 'mobile-quick-feed-name';
  name.dir = 'auto';
  name.textContent = label;
  const total = document.createElement('span');
  total.className = 'mobile-quick-feed-count';
  total.textContent = count;
  button.append(name, total);
  button.addEventListener('click', () => {
    setMobileFeedsOpen(false);
    selectFeedAndScroll(key);
  });
  return button;
}

function renderFeedManager() {
  const list = document.getElementById('feed-manager-list');
  const search = document.getElementById('feed-manager-search');
  if (!list || !search) return;
  const query = search.value.trim().toLocaleLowerCase();
  const feeds = state.feeds.filter(feed =>
    !query || feed.name.toLocaleLowerCase().includes(query) || (feed.url || '').toLocaleLowerCase().includes(query)
  );
  list.innerHTML = '';
  for (const feed of feeds) {
    const item = document.createElement('div');
    item.className = 'feed-manager-item';
    if (hasRtlText(feed.name)) item.classList.add('rtl-feed');

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'feed-manager-open';
    const name = document.createElement('span');
    name.className = 'feed-manager-name';
    name.dir = 'auto';
    name.textContent = feed.name;
    open.append(name);
    open.addEventListener('click', () => {
      selectFeedAndScroll(feed.id);
      navigateToReader();
    });

    const actions = document.createElement('div');
    actions.className = 'feed-manager-actions';
    const count = document.createElement('span');
    count.className = 'feed-manager-count';
    count.textContent = countFor(feed.id);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'feed-manager-delete';
    remove.setAttribute('aria-label', state.lang === 'ar' ? 'حذف' : 'Delete');
    remove.title = state.lang === 'ar' ? 'حذف' : 'Delete';
    remove.innerHTML = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>';
    remove.addEventListener('click', async () => {
      if (!confirm(t('removeFeedConfirm').replace('{name}', feed.name))) {
        remove.blur();
        return;
      }
      remove.disabled = true;
      await api.deleteFeed(feed.id);
      if (state.selected === feed.id) state.selected = 'all';
      await loadAll();
      renderFeedManager();
    });
    actions.append(count, remove);
    item.append(open, actions);
    list.appendChild(item);
  }
  if (!feeds.length) {
    const empty = document.createElement('p');
    empty.className = 'state';
    empty.textContent = state.lang === 'ar' ? 'لا توجد خلاصات مطابقة.' : 'No matching feeds.';
    list.appendChild(empty);
  }
}

function applyRoute() {
  const managing = window.location.pathname === '/manage-feeds';
  document.body.classList.toggle('managing-feeds', managing);
  document.getElementById('feed-manager').hidden = !managing;
  if (managing) {
    setMobileFeedsOpen(false);
    setMobileMoreOpen(false);
    setMobileSearchOpen(false);
    renderFeedManager();
    window.scrollTo({ top: 0 });
  }
}

function navigateToManager() {
  history.pushState({}, '', '/manage-feeds');
  applyRoute();
}

function navigateToReader() {
  history.pushState({}, '', '/');
  applyRoute();
  showMobileHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const badge = document.createElement('span');
  badge.className = 'nav-badge';
  badge.textContent = count;
  meta.appendChild(badge);

  item.append(name, meta);
  item.addEventListener('click', () => {
    selectFeedAndScroll(key);
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
    empty.textContent = state.search
      ? t('noArticlesMatch')
      : t(state.selected === 'all' ? 'noArticlesYet' : 'noArticlesInFeed');
    cards.appendChild(empty);
    return;
  }

  list.forEach((article, index) => cards.appendChild(renderCard(article, index === 0)));
}

function renderCard(a, featured) {
  const card = document.createElement('article');
  card.className = 'card article-card';
  if (featured) card.classList.add('featured-article');
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
      const src = document.createElement('button');
      src.type = 'button';
      src.className = 'card-source';
      src.dir = 'auto';
      src.textContent = a.sourceFeedName;
      src.addEventListener('click', (e) => {
        e.stopPropagation();
        selectFeedAndScroll(a.sourceFeedId);
      });
      head.appendChild(src);
    }
    if (showDate) {
      if (showSource) {
        const separator = document.createElement('span');
        separator.className = 'card-meta-separator';
        separator.textContent = '•';
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

  const imageUrl = safeHref(a.imageUrl);
  if (imageUrl) {
    card.classList.add('has-image');
    const wrap = document.createElement('div');
    wrap.className = 'card-image-wrap';
    const image = document.createElement('img');
    image.className = 'card-image';
    image.src = imageUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => {
      wrap.remove();
      card.classList.remove('has-image');
    });
    wrap.appendChild(image);
    cardMain.appendChild(wrap);
  }
  cardMain.appendChild(cardText);
  card.appendChild(cardMain);
  card.addEventListener('click', () => openArticle(a));

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

let mobileHeaderScrollAnchor = window.scrollY;
function showMobileHeader() {
  const header = document.getElementById('mobile-header');
  if (header) header.classList.remove('mobile-header-hidden');
}
function mobileSearchIsOpen() {
  const panel = document.getElementById('mobile-search-panel');
  return Boolean(panel && !panel.hidden);
}
function mobileMoreIsOpen() {
  const menu = document.getElementById('mobile-more-menu');
  return Boolean(menu && !menu.hidden);
}
function mobileFeedsIsOpen() {
  const panel = document.getElementById('mobile-feeds-panel');
  return Boolean(panel && !panel.hidden);
}
function setMobileFeedsOpen(open) {
  const panel = document.getElementById('mobile-feeds-panel');
  const toggle = document.getElementById('mobile-feeds-link');
  const search = document.getElementById('mobile-feed-search');
  if (!panel || !toggle || !search) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    setMobileMoreOpen(false);
    setMobileSearchOpen(false);
    renderQuickFeeds();
    showMobileHeader();
    requestAnimationFrame(() => search.focus());
  } else {
    search.value = '';
  }
}
function setMobileMoreOpen(open) {
  const menu = document.getElementById('mobile-more-menu');
  const toggle = document.getElementById('mobile-more-toggle');
  if (!menu || !toggle) return;
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    setMobileSearchOpen(false);
    showMobileHeader();
  }
}
function setMobileSearchOpen(open) {
  const panel = document.getElementById('mobile-search-panel');
  const toggle = document.getElementById('mobile-search-toggle');
  const input = document.getElementById('mobile-search');
  if (!panel || !toggle || !input) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    showMobileHeader();
    requestAnimationFrame(() => input.focus());
  }
}
function updateMobileHeaderOnScroll() {
  if (window.innerWidth > 768) {
    showMobileHeader();
    mobileHeaderScrollAnchor = window.scrollY;
    return;
  }

  const currentY = Math.max(0, window.scrollY);
  if (currentY < 24 || mobileSearchIsOpen() || mobileMoreIsOpen() || mobileFeedsIsOpen()) {
    showMobileHeader();
    mobileHeaderScrollAnchor = currentY;
    return;
  }

  const delta = currentY - mobileHeaderScrollAnchor;
  if (Math.abs(delta) < 12) return;
  document.getElementById('mobile-header')?.classList.toggle('mobile-header-hidden', delta > 0);
  mobileHeaderScrollAnchor = currentY;
}

let refreshAllPromise = null;
const feedRefreshPromises = new Map();
function refreshAllArticles() {
  if (refreshAllPromise) return refreshAllPromise;
  refreshAllPromise = (async () => {
    await api.refreshAll();
    await reloadArticles();
  })().finally(() => {
    refreshAllPromise = null;
  });
  return refreshAllPromise;
}

function refreshSelection(key) {
  if (key === 'all') return refreshAllArticles();
  if (feedRefreshPromises.has(key)) return feedRefreshPromises.get(key);
  const promise = (async () => {
    await api.refreshFeed(key);
    await reloadArticles();
  })().finally(() => feedRefreshPromises.delete(key));
  feedRefreshPromises.set(key, promise);
  return promise;
}

function selectFeedAndScroll(key) {
  state.selected = key;
  rememberFeed(key);
  renderSidebar();
  renderCards();
  showMobileHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const pullRefresh = document.getElementById('pull-refresh');
let pullRefreshStartY = 0;
let pullRefreshTracking = false;
let pullRefreshArmed = false;

function resetPullRefresh() {
  pullRefreshTracking = false;
  pullRefreshArmed = false;
  pullRefresh.classList.remove('visible', 'armed');
  pullRefresh.classList.add('settling');
  pullRefresh.style.setProperty('--pull-distance', '0px');
  pullRefresh.style.setProperty('--pull-rotation', '0deg');
  window.setTimeout(() => pullRefresh.classList.remove('settling'), 190);
}

function canStartPullRefresh(event) {
  if (window.innerWidth > 768 || window.scrollY > 0 || refreshAllPromise) return false;
  if (mobileSearchIsOpen()) return false;
  return !event.target.closest('input, textarea, select, button, a');
}

document.addEventListener('touchstart', (event) => {
  if (event.touches.length !== 1 || !canStartPullRefresh(event)) return;
  pullRefreshStartY = event.touches[0].clientY;
  pullRefreshTracking = true;
  pullRefreshArmed = false;
}, { passive: true });

document.addEventListener('touchmove', (event) => {
  if (!pullRefreshTracking || event.touches.length !== 1) return;
  const distance = event.touches[0].clientY - pullRefreshStartY;
  if (distance <= 0 || window.scrollY > 0) {
    resetPullRefresh();
    return;
  }

  event.preventDefault();
  const visualDistance = Math.min(96, distance * 0.72);
  pullRefreshArmed = distance >= 72;
  pullRefresh.classList.add('visible');
  pullRefresh.classList.toggle('armed', pullRefreshArmed);
  pullRefresh.style.setProperty('--pull-distance', `${visualDistance}px`);
  pullRefresh.style.setProperty('--pull-rotation', `${Math.min(300, distance * 3)}deg`);
}, { passive: false });

document.addEventListener('touchend', () => {
  if (!pullRefreshTracking) return;
  const shouldRefresh = pullRefreshArmed;
  pullRefreshTracking = false;
  pullRefreshArmed = false;
  if (!shouldRefresh) {
    resetPullRefresh();
    return;
  }

  showMobileHeader();
  pullRefresh.classList.remove('armed');
  pullRefresh.classList.add('refreshing');
  refreshSelection(state.selected).catch(() => {
    // Keep displaying cached articles if a feed cannot be refreshed.
  }).finally(() => {
    pullRefresh.classList.remove('refreshing');
    resetPullRefresh();
  });
}, { passive: true });

document.addEventListener('touchcancel', resetPullRefresh, { passive: true });

// ---------- events ----------
document.getElementById('sidebar-feed-search').addEventListener('input', renderSidebar);
document.getElementById('sidebar-manage-feeds').addEventListener('click', navigateToManager);

document.getElementById('refresh-all').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const selected = state.selected;
  btn.disabled = true;
  btn.textContent = '⟳ ' + t(selected === 'all' ? 'refreshingAll' : 'refreshingFeed');
  try {
    await refreshSelection(selected);
  } catch {
    // Keep displaying cached articles if refreshing fails.
  } finally {
    btn.disabled = false;
    updateSidebarRefreshLabel();
  }
});

document.getElementById('search').addEventListener('input', (e) => {
  state.search = e.target.value;
  document.getElementById('mobile-search').value = state.search;
  renderCards();
});

document.getElementById('mobile-search-toggle').addEventListener('click', () => {
  setMobileMoreOpen(false);
  setMobileFeedsOpen(false);
  setMobileSearchOpen(!mobileSearchIsOpen());
});

document.getElementById('mobile-more-toggle').addEventListener('click', (e) => {
  e.stopPropagation();
  setMobileFeedsOpen(false);
  setMobileMoreOpen(!mobileMoreIsOpen());
});

document.getElementById('mobile-feeds-link').addEventListener('click', () => {
  setMobileFeedsOpen(!mobileFeedsIsOpen());
});

document.getElementById('mobile-feed-search').addEventListener('input', renderQuickFeeds);
document.getElementById('mobile-manage-feeds').addEventListener('click', () => {
  setMobileFeedsOpen(false);
  navigateToManager();
});

document.getElementById('feed-manager-back').addEventListener('click', navigateToReader);
document.getElementById('feed-manager-search').addEventListener('input', renderFeedManager);
document.getElementById('feed-manager-url').addEventListener('input', function () {
  document.getElementById('feed-manager-add-button').hidden = !this.value.trim();
});
window.addEventListener('popstate', applyRoute);

document.getElementById('feed-manager-add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('feed-manager-url');
  const button = document.getElementById('feed-manager-add-button');
  const error = document.getElementById('feed-manager-error');
  const url = input.value.trim();
  if (!url) return;
  error.hidden = true;
  button.disabled = true;
  const response = await api.addFeed(url);
  button.disabled = false;
  if (response.ok) {
    input.value = '';
    button.hidden = true;
    await loadAll();
    renderFeedManager();
    return;
  }
  let message = t('couldNotAddFeed');
  try { message = await response.json(); } catch { try { message = await response.text(); } catch { /* ignore */ } }
  error.textContent = localizeFeedError((typeof message === 'string' && message) ? message : t('couldNotAddFeed'));
  error.hidden = false;
});

document.getElementById('mobile-home').addEventListener('click', async () => {
  if (window.location.pathname === '/manage-feeds') {
    navigateToReader();
    return;
  }
  setMobileMoreOpen(false);
  setMobileSearchOpen(false);
  showMobileHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const button = document.getElementById('mobile-home');
  button.disabled = true;
  try {
    await refreshSelection(state.selected);
  } catch {
    // Keep displaying cached articles if a feed cannot be refreshed.
  } finally {
    button.disabled = false;
  }
});

document.getElementById('mobile-search').addEventListener('input', (e) => {
  state.search = e.target.value;
  document.getElementById('search').value = state.search;
  renderCards();
  if (!state.search) setMobileSearchOpen(false);
});

document.getElementById('catch-me-up').addEventListener('click', () => {
  generateDailyBrief(false);
});
document.getElementById('mobile-catch-me-up').addEventListener('click', () => {
  generateDailyBrief(false);
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
});
document.getElementById('mobile-theme-toggle').addEventListener('click', () => {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  setMobileMoreOpen(false);
});

document.getElementById('lang-toggle').addEventListener('click', () => {
  applyLanguage(state.lang === 'ar' ? 'en' : 'ar', true);
});
document.getElementById('mobile-lang-toggle').addEventListener('click', () => {
  applyLanguage(state.lang === 'ar' ? 'en' : 'ar', true);
  setMobileMoreOpen(false);
});

document.getElementById('scroll-top').addEventListener('click', () => {
  showMobileHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshSelection(state.selected).catch(() => { /* retain cached articles when refresh fails */ });
});

window.addEventListener('scroll', updateScrollTopButton, { passive: true });
window.addEventListener('scroll', updateMobileHeaderOnScroll, { passive: true });
window.addEventListener('resize', updateMobileHeaderOnScroll, { passive: true });

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeModal();
  if (mobileSearchIsOpen()) setMobileSearchOpen(false);
  if (mobileMoreIsOpen()) setMobileMoreOpen(false);
  if (mobileFeedsIsOpen()) setMobileFeedsOpen(false);
});

document.addEventListener('click', (e) => {
  if (mobileMoreIsOpen()) {
    const menu = document.getElementById('mobile-more-menu');
    const toggle = document.getElementById('mobile-more-toggle');
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setMobileMoreOpen(false);
  }
  if (mobileFeedsIsOpen()) {
    const panel = document.getElementById('mobile-feeds-panel');
    const toggle = document.getElementById('mobile-feeds-link');
    if (!panel.contains(e.target) && !toggle.contains(e.target)) setMobileFeedsOpen(false);
  }
});

// ---------- init ----------
(function init() {
  let theme = 'light';
  let lang = 'en';
  try { theme = localStorage.getItem('rss-theme') || 'light'; } catch { /* ignore */ }
  try { lang = localStorage.getItem('rss-lang') || 'en'; } catch { /* ignore */ }
  applyTheme(theme);
  applyLanguage(lang, false);
  updateScrollTopButton();
  applyRoute();
  loadAll();
})();
