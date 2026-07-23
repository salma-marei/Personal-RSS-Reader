const api = {
  feeds: () => fetch('/feeds').then(r => r.json()),
  addFeed: (url) => fetch('/feeds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  }),
  addTopicFeed: (query, language, country) => fetch('/feeds/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, language, country })
  }),
  refreshFeed: (id) => fetch('/feeds/' + id + '/refresh', { method: 'POST' }),
  refreshAll: () => fetch('/feeds/refresh', { method: 'POST' }),
  river: () => fetch('/river').then(r => r.json()),
  dailyBrief: (request) => fetch('/daily-brief', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  }),
  me: () => fetch('/api/auth/me').then(r => r.json()),
  register: (email, password) => fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }),
  login: (email, password, rememberMe) => fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe })
  }),
  verifyEmail: (email, code) => fetch('/api/auth/verify-email', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code })
  }),
  resendVerification: (email) => fetch('/api/auth/resend-verification', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
  }),
  logout: () => fetch('/api/auth/logout', { method: 'POST' }),
  subscriptions: () => fetch('/api/subscriptions').then(r => r.json()),
  subscribe: (feedId) => fetch('/api/subscriptions/' + feedId, { method: 'POST' }),
  unsubscribe: (feedId) => fetch('/api/subscriptions/' + feedId, { method: 'DELETE' }),
  articleStates: () => fetch('/api/article-states').then(r => r.json()),
  setArticleRead: (request) => fetch('/api/article-states/read', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request)
  }),
  setReadLater: (request) => fetch('/api/article-states/read-later', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request)
  }),
};

const i18n = {
  en: {
    readTime: '{minutes} min read',
    categorySpotlight: 'Category spotlight',
    closeCategory: 'Close category spotlight',
    collapseBrief: 'Collapse news brief',
    expandBrief: 'Expand news brief',
    openFullBrief: 'Open full brief',
    add: 'Add',
    addFeedUrl: 'Add feed URL...',
    allFeeds: 'All Feeds',
    backToTop: 'Head to the top!',
    by: 'by',
    catchMeUp: 'Catch Me Up',
    briefCoverage: 'Brief coverage',
    briefRangeHours: '{hours} hours',
    briefRangeArticleCount: '{count} articles',
    briefRangeArticleCountOne: '1 article',
    briefRangeLocked: 'Sign in to change the coverage and generate another brief.',
    close: 'Close',
    copied: 'Copied!',
    copySummary: 'Copy Summary',
    couldNotAddFeed: 'Could not add feed.',
    feeds: 'Feeds',
    generatedAt: 'Generated at {time}',
    generatedFrom: 'Generated from {articles} articles across {feeds} feeds',
    coveringHours: 'Covering the last {hours} hours',
    generatingBrief: 'Generating your AI News Brief...',
    justNow: 'just now',
    langToggle: 'ع',
    loading: 'Loading...',
    new: 'NEW',
    noArticlesMatch: 'No articles match your search.',
    noArticlesYet: 'No articles yet. Try "Refresh all".',
    noArticlesInFeed: 'No articles yet. Try refreshing this feed.',
    noArticlesToday: 'No articles were published in the last 24 hours.',
    noFeeds: 'No feeds yet. Open Discover Feeds to add your first subscription.',
    myFeeds: 'My Feeds',
    chooseFeeds: 'Choose feeds',
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
    search: 'Search',
    suggestedFeeds: 'Suggested Feeds',
    briefFailed: 'The AI News Brief could not be generated. Please try again.',
    briefNotConfigured: 'The AI News Brief is not configured yet.',
    briefTitle: 'AI News Brief',
    briefDisplayTitle: 'News Brief',
    briefCooldown: 'Please wait at least one minute between regenerations.',
    briefDailyLimit: 'You have used all 5 brief regenerations for today.',
    briefGlobalLimit: 'The AI News Brief has reached its generation limit for today.',
    briefNeedsFeeds: 'Subscribe to at least one feed to create your personal brief.',
    briefQuota: 'You have {remaining} regenerations today.',
    briefQuotaOne: 'You have 1 regeneration today.',
    retry: 'Retry',
    createAccount: 'Create account',
    signIn: 'Sign in',
    continueWithGoogle: 'Continue with Google',
    orContinueWithGoogle: 'or continue with Google',
    googleAuthFailed: 'Google sign-in could not be completed. Please try again.',
    verifyEmail: 'Verify your email',
    verificationSubtitle: 'Enter the code we sent to your email.',
    verificationCopy: 'We sent a six-digit code to {email}. It expires in 10 minutes.',
    verificationSpamHint: 'Can\'t find it? Check your spam or junk folder.',
    verificationCode: 'Verification code',
    resendCode: 'Resend code',
    resendCodeIn: 'Resend code in {seconds}s',
    codeResent: 'A new verification code was sent.',
    signOut: 'Sign out',
    email: 'Email',
    password: 'Password',
    passwordHelp: 'Use at least 8 characters, including a letter and number.',
    rememberMe: 'Remember me for 30 days',
    registerSubtitle: 'Create an account to start building your personal reader.',
    loginSubtitle: 'Continue building your personal reader.',
    switchToRegister: 'Don\'t have an account? Create one',
    switchToLogin: 'Already have an account? Sign in',
    authenticating: 'Please wait...',
    authFailed: 'Something went wrong. Please try again.',
    account: 'Account',
    welcomeReader: 'Welcome to Feed Reader',
    guestAccountDescription: 'Sign in to start building your personal reader.',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed',
    unsubscribe: 'Unsubscribe',
    addedToMyFeeds: 'Subscribed to {name}',
    myFeedsEmpty: 'You have not subscribed to any feeds yet.',
    noSuggestedFeeds: 'No suggested feeds match your search.',
    discoverFeeds: 'Explore Feeds',
    manageDiscoverFeeds: 'Manage & Explore Feeds',
    unsubscribeConfirm: 'Unsubscribe from "{name}"?',
    createPersonalFeed: 'Create your personal feed',
    subscriptionPrompt: 'Sign in to subscribe to feeds and keep your reading list across devices.',
    notNow: 'Not now',
    guestManageNote: 'Browse suggested feeds. Sign in when you are ready to subscribe.',
    userManageNote: 'Choose the suggested feeds you want in your personal reader.',
    readLater: 'Read Later',
    addToReadLater: 'Add to Read Later',
    removeFromReadLater: 'Remove from Read Later',
    addedToReadLater: 'Added to Read Later',
    readLaterPrompt: 'Sign in to keep this article in your Read Later list.',
    readLaterEmpty: 'Nothing saved yet. Bookmark an article to save it for later.',
    buildMyFeeds: 'My Feeds',
    welcomePersonalReader: 'Build your personal news feed',
    chooseStartingFeeds: "Choose a few trusted sources to start. We'll keep everything updated automatically.",
    articlesAvailable: '{count} recent articles',
    switchLanguage: 'Switch language',
    sourceLinks: 'Contributing sources',
    sources: '{count} sources',
    themeDark: 'Switch to dark mode',
    themeLight: 'Switch to light mode',
    takesFewSeconds: 'This may take a few seconds.',
    untitled: '(untitled)',
    urlRequired: 'URL is required.',
    topicRequired: 'Enter a news topic to follow.',
    units: { m: 'm ago', h: 'h ago', d: 'd ago', mo: 'mo ago', y: 'y ago' },
  },
  ar: {
    readTime: '\u0642\u0631\u0627\u0621\u0629 {minutes} \u062f',
    briefCoverage: '\u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u0648\u062c\u0632',
    briefRangeHours: '{hours} \u0633\u0627\u0639\u0629',
    briefRangeArticleCount: '{count} \u0645\u0642\u0627\u0644\u0627\u062a',
    briefRangeArticleCountOne: '\u0645\u0642\u0627\u0644 \u0648\u0627\u062d\u062f',
    briefRangeLocked: '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0646\u0637\u0627\u0642 \u0648\u0625\u0646\u0634\u0627\u0621 \u0645\u0648\u062c\u0632 \u0622\u062e\u0631.',
    coveringHours: '\u064a\u063a\u0637\u064a \u0622\u062e\u0631 {hours} \u0633\u0627\u0639\u0629',
    suggestedFeeds: '\u062e\u0644\u0627\u0635\u0627\u062a \u0645\u0642\u062a\u0631\u062d\u0629',
    createAccount: '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628',
    signIn: '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',
    continueWithGoogle: '\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Google',
    orContinueWithGoogle: '\u0623\u0648 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Google',
    googleAuthFailed: '\u062a\u0639\u0630\u0631 \u0625\u0643\u0645\u0627\u0644 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Google. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',
    verifyEmail: '\u062a\u0623\u0643\u064a\u062f \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    verificationSubtitle: '\u0623\u062f\u062e\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0630\u064a \u0623\u0631\u0633\u0644\u0646\u0627\u0647 \u0625\u0644\u0649 \u0628\u0631\u064a\u062f\u0643.',
    verificationCopy: '\u0623\u0631\u0633\u0644\u0646\u0627 \u0631\u0645\u0632\u064b\u0627 \u0645\u0643\u0648\u0646\u064b\u0627 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645 \u0625\u0644\u0649 {email}. \u062a\u0646\u062a\u0647\u064a \u0635\u0644\u0627\u062d\u064a\u062a\u0647 \u0628\u0639\u062f 10 \u062f\u0642\u0627\u0626\u0642.',
    verificationSpamHint: '\u0644\u0645 \u062a\u062c\u062f\u0647\u061f \u062a\u062d\u0642\u0642 \u0645\u0646 \u0645\u062c\u0644\u062f \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u063a\u064a\u0631 \u0627\u0644\u0645\u0631\u063a\u0648\u0628 \u0641\u064a\u0647\u0627.',
    verificationCode: '\u0631\u0645\u0632 \u0627\u0644\u062a\u0623\u0643\u064a\u062f',
    resendCode: '\u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632',
    resendCodeIn: '\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0628\u0639\u062f {seconds} \u062b',
    codeResent: '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u062a\u0623\u0643\u064a\u062f \u062c\u062f\u064a\u062f.',
    signOut: '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c',
    email: '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    password: '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
    passwordHelp: '\u0627\u0633\u062a\u062e\u062f\u0645 8 \u0623\u062d\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644\u060c \u0628\u0645\u0627 \u0641\u064a \u0630\u0644\u0643 \u062d\u0631\u0641 \u0648\u0631\u0642\u0645.',
    rememberMe: '\u062a\u0630\u0643\u0631\u0646\u064a \u0644\u0645\u062f\u0629 30 \u064a\u0648\u0645\u064b\u0627',
    registerSubtitle: '\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u064b\u0627 \u0644\u0628\u062f\u0621 \u062a\u062e\u0635\u064a\u0635 \u0642\u0627\u0631\u0626\u0643.',
    loginSubtitle: '\u062a\u0627\u0628\u0639 \u0628\u0646\u0627\u0621 \u0642\u0627\u0631\u0626\u0643 \u0627\u0644\u0634\u062e\u0635\u064a.',
    switchToRegister: '\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f \u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u064b\u0627',
    switchToLogin: '\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f \u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',
    authenticating: '\u064a\u0631\u062c\u0649 \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631...',
    authFailed: '\u062d\u062f\u062b \u062e\u0637\u0623. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',
    account: '\u0627\u0644\u062d\u0633\u0627\u0628',
    welcomeReader: '\u0645\u0631\u062d\u0628\u064b\u0627 \u0628\u0643 \u0641\u064a \u0642\u0627\u0631\u0626 \u0627\u0644\u062e\u0644\u0627\u0635\u0627\u062a',
    guestAccountDescription: '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0628\u062f\u0621 \u0628\u0646\u0627\u0621 \u0642\u0627\u0631\u0626\u0643 \u0627\u0644\u0634\u062e\u0635\u064a.',
    subscribe: '\u0627\u0634\u062a\u0631\u0627\u0643',
    subscribed: '\u0645\u0634\u062a\u0631\u0643',
    unsubscribe: '\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643',
    addedToMyFeeds: '\u062a\u0645 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0641\u064a {name}',
    myFeedsEmpty: '\u0644\u0645 \u062a\u0634\u062a\u0631\u0643 \u0641\u064a \u0623\u064a \u062e\u0644\u0627\u0635\u0627\u062a \u0628\u0639\u062f.',
    noSuggestedFeeds: '\u0644\u0627 \u062a\u0648\u062c\u062f \u062e\u0644\u0627\u0635\u0627\u062a \u0645\u0642\u062a\u0631\u062d\u0629 \u062a\u0637\u0627\u0628\u0642 \u0628\u062d\u062b\u0643.',
    discoverFeeds: '\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u062e\u0644\u0627\u0635\u0627\u062a',
    manageDiscoverFeeds: '\u0625\u062f\u0627\u0631\u0629 \u0648\u0627\u0643\u062a\u0634\u0627\u0641 \u0627\u0644\u062e\u0644\u0627\u0635\u0627\u062a',
    unsubscribeConfirm: '\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0641\u064a "{name}"\u061f',
    createPersonalFeed: '\u0623\u0646\u0634\u0626 \u0642\u0627\u0631\u0626\u0643 \u0627\u0644\u0634\u062e\u0635\u064a',
    subscriptionPrompt: '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0641\u064a \u0627\u0644\u062e\u0644\u0627\u0635\u0627\u062a \u0648\u0627\u0644\u0627\u062d\u062a\u0641\u0627\u0638 \u0628\u0642\u0627\u0626\u0645\u0629 \u0642\u0631\u0627\u0621\u062a\u0643 \u0639\u0628\u0631 \u0627\u0644\u0623\u062c\u0647\u0632\u0629.',
    notNow: '\u0644\u064a\u0633 \u0627\u0644\u0622\u0646',
    guestManageNote: '\u062a\u0635\u0641\u062d \u0627\u0644\u062e\u0644\u0627\u0635\u0627\u062a \u0627\u0644\u0645\u0642\u062a\u0631\u062d\u0629. \u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0639\u0646\u062f\u0645\u0627 \u062a\u0631\u064a\u062f \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643.',
    userManageNote: '\u0627\u062e\u062a\u0631 \u0627\u0644\u062e\u0644\u0627\u0635\u0627\u062a \u0627\u0644\u0645\u0642\u062a\u0631\u062d\u0629 \u0627\u0644\u062a\u064a \u062a\u0631\u064a\u062f\u0647\u0627 \u0641\u064a \u0642\u0627\u0631\u0626\u0643 \u0627\u0644\u0634\u062e\u0635\u064a.',
    readLater: '\u0627\u0642\u0631\u0623 \u0644\u0627\u062d\u0642\u064b\u0627',
    addToReadLater: '\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0642\u0631\u0623 \u0644\u0627\u062d\u0642\u064b\u0627',
    removeFromReadLater: '\u0625\u0632\u0627\u0644\u0629 \u0645\u0646 \u0627\u0642\u0631\u0623 \u0644\u0627\u062d\u0642\u064b\u0627',
    addedToReadLater: '\u062a\u0645\u062a \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0642\u0631\u0623 \u0644\u0627\u062d\u0642\u064b\u0627',
    readLaterPrompt: '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0644\u0627\u062d\u062a\u0641\u0627\u0638 \u0628\u0647\u0630\u0647 \u0627\u0644\u0645\u0642\u0627\u0644\u0629 \u0641\u064a \u0642\u0627\u0626\u0645\u0629 \u0627\u0642\u0631\u0623 \u0644\u0627\u062d\u0642\u064b\u0627.',
    readLaterEmpty: '\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0642\u0627\u0644\u0627\u062a \u0645\u062d\u0641\u0648\u0638\u0629 \u0628\u0639\u062f. \u0627\u062d\u0641\u0638 \u0645\u0642\u0627\u0644\u0629 \u0628\u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0631\u062c\u0639\u064a\u0629 \u0644\u0642\u0631\u0627\u0621\u062a\u0647\u0627 \u0644\u0627\u062d\u0642\u064b\u0627.',
    buildMyFeeds: '\u062e\u0644\u0627\u0635\u0627\u062a\u064a',
    welcomePersonalReader: '\u0627\u0628\u0646\u0650 \u0645\u0648\u062c\u0632\u0643 \u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a \u0627\u0644\u0634\u062e\u0635\u064a',
    chooseStartingFeeds: '\u0627\u062e\u062a\u0631 \u0628\u0639\u0636 \u0627\u0644\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u0629 \u0644\u0644\u0628\u062f\u0621. \u0633\u0646\u062d\u0627\u0641\u0638 \u0639\u0644\u0649 \u062a\u062d\u062f\u064a\u062b \u0643\u0644 \u0634\u064a\u0621 \u062a\u0644\u0642\u0627\u0626\u064a\u064b\u0627.',
    articlesAvailable: '{count} \u0645\u0642\u0627\u0644\u0629 \u062d\u062f\u064a\u062b\u0629',
    categorySpotlight: '\u0646\u0638\u0631\u0629 \u0645\u0631\u0643\u0632\u0629',
    closeCategory: '\u0625\u063a\u0644\u0627\u0642 \u0646\u0638\u0631\u0629 \u0627\u0644\u0641\u0626\u0629',
    collapseBrief: '\u0637\u064a \u0645\u0648\u062c\u0632 \u0627\u0644\u0623\u062e\u0628\u0627\u0631',
    expandBrief: '\u062a\u0648\u0633\u064a\u0639 \u0645\u0648\u062c\u0632 \u0627\u0644\u0623\u062e\u0628\u0627\u0631',
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
    generatingBrief: 'جارٍ إنشاء موجز الأخبار بالذكاء الاصطناعي...',
    justNow: 'الآن',
    langToggle: 'EN',
    loading: 'جار التحميل...',
    new: 'جديد',
    noArticlesMatch: 'لا توجد مقالات تطابق البحث.',
    noArticlesYet: 'لا توجد مقالات بعد. جرّب "تحديث الكل".',
    noArticlesInFeed: 'لا توجد مقالات بعد. جرّب تحديث هذه الخلاصة.',
    noArticlesToday: 'لم تُنشر أي مقالات خلال آخر 24 ساعة.',
    noFeeds: 'لا توجد خلاصات بعد. افتح إدارة الخلاصات لإضافة اشتراكك الأول.',
    myFeeds: '\u062e\u0644\u0627\u0635\u0627\u062a\u064a',
    chooseFeeds: '\u0627\u062e\u062a\u0631 \u062e\u0644\u0627\u0635\u0627\u062a',
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
    search: 'بحث',
    briefFailed: 'تعذر إنشاء موجز الأخبار. يُرجى المحاولة مرة أخرى.',
    briefNotConfigured: 'لم يتم إعداد موجز الأخبار بعد.',
    briefTitle: 'موجز الأخبار بالذكاء الاصطناعي',
    briefDisplayTitle: 'موجز الأخبار',
    briefCooldown: 'يُرجى الانتظار دقيقة واحدة على الأقل بين مرات إعادة الإنشاء.',
    briefDailyLimit: 'لقد استخدمت محاولات إعادة الإنشاء الخمس المتاحة اليوم.',
    briefGlobalLimit: 'وصل موجز الأخبار إلى الحد الإجمالي للإنشاء اليوم.',
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
    coverageMode: 0,
  },
  auth: {
    loading: true,
    user: null,
    mode: 'login',
    verificationEmail: '',
    resendAvailableAt: 0,
    pendingSubscriptionId: null,
    pendingFeedUrl: null,
    pendingReadLaterArticle: null,
  },
  subscriptions: new Set(),
  articleStates: new Map(),
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

// ---------- authentication ----------
async function loadAuthState() {
  try {
    const result = await api.me();
    state.auth.user = result.isAuthenticated ? result : null;
    await loadSubscriptions();
    await loadArticleStates();
  } catch {
    state.auth.user = null;
    state.subscriptions.clear();
    state.articleStates.clear();
  } finally {
    state.auth.loading = false;
    updateAuthUi();
  }
}

function updateAuthUi() {
  const signedIn = Boolean(state.auth.user);
  const email = state.auth.user?.email || '';
  const initial = email.trim().charAt(0).toLocaleUpperCase();

  for (const button of document.querySelectorAll('.profile-button')) {
    button.setAttribute('aria-label', t('account'));
    button.querySelector('.profile-guest-icon').hidden = signedIn;
    const initialElement = button.querySelector('.profile-initial');
    initialElement.hidden = !signedIn;
    initialElement.textContent = initial;
  }

  for (const menu of document.querySelectorAll('.profile-menu')) {
    menu.querySelector('.profile-menu-guest').hidden = signedIn;
    menu.querySelector('.profile-menu-user').hidden = !signedIn;
    menu.querySelector('.profile-menu-title').textContent = t('welcomeReader');
    menu.querySelector('.profile-menu-description').textContent = t('guestAccountDescription');
    menu.querySelector('[data-auth-action="login"]').textContent = t('signIn');
    menu.querySelector('[data-auth-action="register"]').textContent = t('createAccount');
    menu.querySelector('.profile-menu-email').textContent = email;
    menu.querySelector('.profile-menu-email').title = email;
    menu.querySelector('.profile-menu-avatar').textContent = initial;
    menu.querySelector('.profile-signout span').textContent = t('signOut');
  }
  updateAuthModalText();
  document.getElementById('auth-gate-title').textContent = t('createPersonalFeed');
  document.getElementById('auth-gate-description').textContent = t('subscriptionPrompt');
  document.getElementById('auth-gate-login').textContent = t('signIn');
  document.getElementById('auth-gate-register').textContent = t('createAccount');
  document.getElementById('auth-gate-dismiss').textContent = t('notNow');
  renderSubscriptionControls();
  renderSidebar();
  renderCards();
  updateDailyBriefButton();
  updateManageFeedLabels();
  if (window.location.pathname === '/manage-feeds') renderFeedManager();
}

function updateAuthModalText() {
  const registering = state.auth.mode === 'register';
  const verifying = state.auth.mode === 'verify';
  document.getElementById('auth-modal-title').textContent =
    t(verifying ? 'verifyEmail' : registering ? 'createAccount' : 'signIn');
  document.getElementById('auth-modal-subtitle').textContent =
    t(verifying ? 'verificationSubtitle' : registering ? 'registerSubtitle' : 'loginSubtitle');
  document.getElementById('auth-form').hidden = verifying;
  document.getElementById('auth-verify-form').hidden = !verifying;
  document.getElementById('auth-google').hidden = verifying;
  document.getElementById('auth-divider').hidden = verifying;
  document.getElementById('auth-switch').hidden = verifying;
  document.getElementById('auth-email-label').textContent = t('email');
  document.getElementById('auth-password-label').textContent = t('password');
  document.getElementById('auth-password-help').textContent = t('passwordHelp');
  document.getElementById('auth-password-help').hidden = !registering;
  document.getElementById('auth-remember-label').textContent = t('rememberMe');
  document.getElementById('auth-remember-row').hidden = registering;
  document.getElementById('auth-submit').textContent =
    t(registering ? 'createAccount' : 'signIn');
  document.getElementById('auth-switch').textContent =
    t(registering ? 'switchToLogin' : 'switchToRegister');
  document.getElementById('auth-password-input').autocomplete =
    registering ? 'new-password' : 'current-password';
  document.getElementById('auth-google-label').textContent = t('continueWithGoogle');
  document.getElementById('auth-divider-label').textContent = t('orContinueWithGoogle');
  if (verifying) {
    document.getElementById('auth-verify-copy').textContent =
      tf('verificationCopy', { email: state.auth.verificationEmail });
    document.getElementById('auth-verify-spam-hint').textContent = t('verificationSpamHint');
    document.getElementById('auth-code-label').textContent = t('verificationCode');
    document.getElementById('auth-verify-submit').textContent = t('verifyEmail');
    updateResendButton();
  }
}

let resendCountdownTimer = null;

function updateResendButton() {
  const button = document.getElementById('auth-resend');
  const seconds = Math.max(0, Math.ceil((state.auth.resendAvailableAt - Date.now()) / 1000));
  button.disabled = seconds > 0;
  button.textContent = seconds > 0 ? tf('resendCodeIn', { seconds }) : t('resendCode');
  if (seconds === 0 && resendCountdownTimer) {
    clearInterval(resendCountdownTimer);
    resendCountdownTimer = null;
  }
}

function enterVerificationMode(email, retryAfterSeconds = 60) {
  state.auth.mode = 'verify';
  state.auth.verificationEmail = email;
  state.auth.resendAvailableAt = Date.now() + retryAfterSeconds * 1000;
  document.getElementById('auth-verify-form').reset();
  document.getElementById('auth-verify-error').hidden = true;
  document.getElementById('auth-verify-copy').textContent = tf('verificationCopy', { email });
  document.getElementById('auth-verify-spam-hint').textContent = t('verificationSpamHint');
  document.getElementById('auth-code-label').textContent = t('verificationCode');
  document.getElementById('auth-verify-submit').textContent = t('verifyEmail');
  updateAuthModalText();
  updateResendButton();
  if (resendCountdownTimer) clearInterval(resendCountdownTimer);
  resendCountdownTimer = setInterval(updateResendButton, 1000);
  requestAnimationFrame(() => document.querySelector('.auth-code-input').focus());
}

const pendingAuthStorageKey = 'rss-pending-auth-action';

function beginGoogleSignIn() {
  const pending = {
    subscriptionId: state.auth.pendingSubscriptionId,
    feedUrl: state.auth.pendingFeedUrl,
    readLaterArticle: state.auth.pendingReadLaterArticle,
  };
  try {
    if (pending.subscriptionId || pending.feedUrl || pending.readLaterArticle) {
      sessionStorage.setItem(pendingAuthStorageKey, JSON.stringify(pending));
    } else {
      sessionStorage.removeItem(pendingAuthStorageKey);
    }
  } catch { /* continue without restoring the pending action */ }
  const button = document.getElementById('auth-google');
  button.disabled = true;
  requestAnimationFrame(() => window.location.assign('/api/auth/google'));
}

async function restorePendingAuthAction() {
  if (!state.auth.user) return;
  let pending = null;
  try {
    pending = JSON.parse(sessionStorage.getItem(pendingAuthStorageKey) || 'null');
    sessionStorage.removeItem(pendingAuthStorageKey);
  } catch { /* ignore invalid or unavailable session storage */ }
  if (!pending) return;
  if (pending.subscriptionId && await subscribeToFeed(pending.subscriptionId)) {
    state.selected = pending.subscriptionId;
    if (window.location.pathname === '/manage-feeds') navigateToReader();
    else {
      renderSidebar();
      renderCards();
    }
  }
  if (pending.feedUrl) await addCustomFeed(pending.feedUrl);
  if (pending.readLaterArticle) await setReadLater(pending.readLaterArticle, true);
}

function showGoogleAuthError() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('authError') !== 'google') return;
  url.searchParams.delete('authError');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
  openAuthModal('login');
  const error = document.getElementById('auth-error');
  error.textContent = t('googleAuthFailed');
  error.hidden = false;
}

function openAuthModal(mode) {
  closeProfileMenus();
  state.auth.mode = mode === 'register' ? 'register' : 'login';
  document.getElementById('auth-error').hidden = true;
  document.getElementById('auth-form').reset();
  updateAuthModalText();
  document.getElementById('auth-modal').hidden = false;
  requestAnimationFrame(() => document.getElementById('auth-email-input').focus());
}

function closeAuthModal(clearPending = true) {
  document.getElementById('auth-modal').hidden = true;
  if (resendCountdownTimer) {
    clearInterval(resendCountdownTimer);
    resendCountdownTimer = null;
  }
  if (clearPending) {
    state.auth.pendingSubscriptionId = null;
    state.auth.pendingFeedUrl = null;
    state.auth.pendingReadLaterArticle = null;
  }
}

async function finishAuthentication(payload) {
  state.auth.user = payload;
  resetDailyBrief();
  closeAuthModal(false);
  await loadSubscriptions();
  await loadArticleStates();
  // A feed selected while browsing as a guest is not part of the signed-in
  // reader unless the user subscribed to it. Start authentication on My Feeds
  // instead of leaving the user on a now-stale preview selection.
  if (!['all', 'read-later'].includes(state.selected) && !isSubscribed(state.selected)) {
    state.selected = 'all';
  }
  const pendingFeedId = state.auth.pendingSubscriptionId;
  const pendingFeedUrl = state.auth.pendingFeedUrl;
  const pendingArticle = state.auth.pendingReadLaterArticle;
  state.auth.pendingSubscriptionId = null;
  state.auth.pendingFeedUrl = null;
  state.auth.pendingReadLaterArticle = null;
  if (pendingFeedId && await subscribeToFeed(pendingFeedId)) {
    state.selected = pendingFeedId;
    if (window.location.pathname === '/manage-feeds') navigateToReader();
  }
  if (pendingFeedUrl) await addCustomFeed(pendingFeedUrl);
  if (pendingArticle) await setReadLater(pendingArticle, true);
  updateAuthUi();
}

function authErrorMessage(payload) {
  if (payload?.error) return payload.error;
  const validationErrors = payload?.errors && Object.values(payload.errors).flat();
  return validationErrors?.[0] || t('authFailed');
}

async function submitAuthForm(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email-input').value.trim();
  const password = document.getElementById('auth-password-input').value;
  const rememberMe = document.getElementById('auth-remember').checked;
  const submit = document.getElementById('auth-submit');
  const error = document.getElementById('auth-error');
  submit.disabled = true;
  submit.textContent = t('authenticating');
  error.hidden = true;

  try {
    const response = state.auth.mode === 'register'
      ? await api.register(email, password)
      : await api.login(email, password, rememberMe);
    const payload = await response.json().catch(() => ({}));
    if (payload.requiresVerification) {
      enterVerificationMode(payload.email || email, payload.retryAfterSeconds || 60);
      return;
    }
    if (!response.ok) throw new Error(authErrorMessage(payload));
    await finishAuthentication(payload);
  } catch (authError) {
    error.textContent = authError instanceof Error ? authError.message : t('authFailed');
    error.hidden = false;
  } finally {
    submit.disabled = false;
    updateAuthModalText();
  }
}

async function submitVerificationForm(event) {
  event.preventDefault();
  const code = [...document.querySelectorAll('.auth-code-input')]
    .map(input => input.value)
    .join('');
  const submit = document.getElementById('auth-verify-submit');
  const error = document.getElementById('auth-verify-error');
  submit.disabled = true;
  submit.textContent = t('authenticating');
  error.hidden = true;
  error.style.color = '';
  try {
    const response = await api.verifyEmail(state.auth.verificationEmail, code);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(authErrorMessage(payload));
    await finishAuthentication(payload);
  } catch (verificationError) {
    error.textContent = verificationError instanceof Error ? verificationError.message : t('authFailed');
    error.hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = t('verifyEmail');
  }
}

async function resendVerificationCode() {
  const button = document.getElementById('auth-resend');
  const error = document.getElementById('auth-verify-error');
  button.disabled = true;
  error.hidden = true;
  try {
    const response = await api.resendVerification(state.auth.verificationEmail);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (payload.retryAfterSeconds) {
        state.auth.resendAvailableAt = Date.now() + payload.retryAfterSeconds * 1000;
        updateResendButton();
      }
      throw new Error(authErrorMessage(payload));
    }
    state.auth.resendAvailableAt = Date.now() + (payload.retryAfterSeconds || 60) * 1000;
    error.textContent = t('codeResent');
    error.style.color = 'var(--accent)';
    error.hidden = false;
    if (resendCountdownTimer) clearInterval(resendCountdownTimer);
    resendCountdownTimer = setInterval(updateResendButton, 1000);
    updateResendButton();
  } catch (resendError) {
    error.style.color = '';
    error.textContent = resendError instanceof Error ? resendError.message : t('authFailed');
    error.hidden = false;
    updateResendButton();
  }
}

async function logout() {
  const response = await api.logout();
  if (!response.ok) return;
  state.auth.user = null;
  resetDailyBrief();
  state.subscriptions.clear();
  state.articleStates.clear();
  state.auth.pendingSubscriptionId = null;
  state.auth.pendingFeedUrl = null;
  state.auth.pendingReadLaterArticle = null;
  state.selected = 'all';
  latestSubscriptionId = null;
  closeProfileMenus();
  updateAuthUi();
  renderSubscriptionControls();
  if (window.location.pathname === '/manage-feeds') renderFeedManager();
}

async function loadSubscriptions() {
  state.subscriptions.clear();
  if (!state.auth.user) return;
  const items = await api.subscriptions();
  for (const item of items || []) state.subscriptions.add(item.feedId);
}

async function loadArticleStates() {
  state.articleStates.clear();
  if (!state.auth.user) return;
  const items = await api.articleStates();
  for (const item of items || []) state.articleStates.set(item.articleKey, item);
}

function isSubscribed(feedId) {
  return state.subscriptions.has(feedId);
}

function openSubscriptionPrompt(feedId) {
  state.auth.pendingSubscriptionId = feedId;
  document.getElementById('auth-gate-modal').hidden = false;
}

function closeSubscriptionPrompt(clearPending = true) {
  document.getElementById('auth-gate-modal').hidden = true;
  if (clearPending) {
    state.auth.pendingSubscriptionId = null;
    state.auth.pendingFeedUrl = null;
    state.auth.pendingReadLaterArticle = null;
  }
}

async function requestSubscription(feedId) {
  if (!state.auth.user) {
    openSubscriptionPrompt(feedId);
    return;
  }
  if (isSubscribed(feedId)) {
    const feed = feedById(feedId);
    if (!confirm(tf('unsubscribeConfirm', { name: feed?.name || '' }))) return;
    await unsubscribeFromFeed(feedId);
    return;
  }
  await subscribeToFeed(feedId);
}

let latestSubscriptionId = null;

async function subscribeToFeed(feedId) {
  const response = await api.subscribe(feedId);
  if (!response.ok) return false;
  state.subscriptions.add(feedId);
  latestSubscriptionId = feedId;
  resetDailyBrief();
  updateDailyBriefButton();
  const feed = feedById(feedId);
  showSubscriptionToast(tf('addedToMyFeeds', { name: feed?.name || '' }), () => {
    clearArticleSearch();
    if (window.location.pathname === '/manage-feeds') navigateToReader();
    selectFeedAndScroll(feedId);
  });
  renderSidebar();
  renderCards();
  renderSubscriptionControls();
  if (window.location.pathname === '/manage-feeds') renderFeedManager();
  return true;
}

let subscriptionToastTimer = null;
let subscriptionToastHideTimer = null;
function showSubscriptionToast(message, onActivate = null) {
  const toast = document.getElementById('subscription-toast');
  if (!toast) return;
  clearTimeout(subscriptionToastTimer);
  clearTimeout(subscriptionToastHideTimer);
  toast.textContent = message;
  toast.classList.toggle('actionable', Boolean(onActivate));
  toast.onclick = onActivate ? () => {
    toast.classList.remove('visible');
    onActivate();
  } : null;
  toast.onkeydown = onActivate ? event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toast.click();
  } : null;
  if (onActivate) {
    toast.tabIndex = 0;
    toast.setAttribute('role', 'button');
  } else {
    toast.removeAttribute('tabindex');
    toast.setAttribute('role', 'status');
  }
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('visible'));
  subscriptionToastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    subscriptionToastHideTimer = setTimeout(() => { toast.hidden = true; }, 180);
  }, 2800);
}

function updateSubscriptionButton(button, subscribed) {
  button.classList.toggle('is-subscribed', subscribed);
  button.replaceChildren();
  if (!subscribed) {
    button.textContent = t('subscribe');
    button.setAttribute('aria-label', t('subscribe'));
    return;
  }

  const status = document.createElement('span');
  status.className = 'subscription-status-label';
  status.textContent = t('subscribed');
  const action = document.createElement('span');
  action.className = 'subscription-action-label';
  action.textContent = t('unsubscribe');
  button.append(status, action);
  button.setAttribute('aria-label', t('unsubscribe'));
}

async function unsubscribeFromFeed(feedId) {
  const response = await api.unsubscribe(feedId);
  if (!response.ok) return;
  state.subscriptions.delete(feedId);
  if (latestSubscriptionId === feedId) latestSubscriptionId = null;
  resetDailyBrief();
  updateDailyBriefButton();
  renderSidebar();
  renderCards();
  renderSubscriptionControls();
  if (window.location.pathname === '/manage-feeds') renderFeedManager();
}

async function addCustomFeed(url) {
  const input = document.getElementById('feed-manager-url');
  const button = document.getElementById('feed-manager-add-button');
  const error = document.getElementById('feed-manager-error');
  if (error) error.hidden = true;
  if (button) button.disabled = true;

  try {
    const response = await api.addFeed(url);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || t('couldNotAddFeed'));

    await loadSubscriptions();
    await loadAll();
    if (input) input.value = '';
    if (payload.feed?.id) {
      state.selected = payload.feed.id;
      navigateToReader();
      renderSidebar();
      renderCards();
    }
  } catch (addError) {
    if (error) {
      error.textContent = addError instanceof Error ? addError.message : t('couldNotAddFeed');
      error.hidden = false;
    }
  } finally {
    if (button) button.disabled = false;
  }
}

async function submitCustomFeed(event) {
  event.preventDefault();
  const input = document.getElementById('feed-manager-url');
  const url = input.value.trim();
  const error = document.getElementById('feed-manager-error');
  if (!url) {
    error.textContent = t('urlRequired');
    error.hidden = false;
    return;
  }
  if (!state.auth.user) {
    state.auth.pendingFeedUrl = url;
    state.auth.pendingSubscriptionId = null;
    openSubscriptionPrompt(null);
    state.auth.pendingFeedUrl = url;
    return;
  }
  await addCustomFeed(url);
}

async function submitTopicFeed(event) {
  event.preventDefault();
  const input = document.getElementById('topic-feed-query');
  const error = document.getElementById('topic-feed-error');
  const query = input.value.trim();

  error.hidden = true;
  if (!query) {
    error.textContent = t('topicRequired');
    error.hidden = false;
    return;
  }

  document.getElementById('topic-feed-result-query').textContent = query;
  document.getElementById('topic-feed-result').hidden = false;
  updateTopicLocaleSummary();
}

async function followTopicFeed() {
  const input = document.getElementById('topic-feed-query');
  const language = document.getElementById('topic-feed-language');
  const country = document.getElementById('topic-feed-country');
  const button = document.getElementById('topic-feed-submit');
  const error = document.getElementById('topic-feed-error');
  const query = input.value.trim();

  if (!state.auth.user) {
    openSubscriptionPrompt(null);
    return;
  }

  button.disabled = true;
  try {
    const response = await api.addTopicFeed(query, language.value, country.value);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || t('couldNotAddFeed'));

    await loadSubscriptions();
    await loadAll();
    input.value = '';
    document.getElementById('topic-feed-result').hidden = true;
    document.getElementById('topic-feed-result-query').textContent = '';
    if (payload.feed?.id) {
      state.selected = payload.feed.id;
      navigateToReader();
      renderSidebar();
      renderCards();
    }
  } catch (topicError) {
    error.textContent = topicError instanceof Error ? topicError.message : t('couldNotAddFeed');
    error.hidden = false;
  } finally {
    button.disabled = false;
  }
}

function updateTopicLocaleSummary() {
  const language = document.getElementById('topic-feed-language');
  const country = document.getElementById('topic-feed-country');
  const languageName = language.options[language.selectedIndex].text;
  const countryName = country.options[country.selectedIndex].text;
  document.getElementById('topic-feed-locale-summary').textContent = `${languageName} · ${countryName}`;
}

function previewTopicFeed() {
  const query = document.getElementById('topic-feed-query').value.trim();
  if (!query) return;
  window.open(`https://news.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
}

function setFeedManagerTab(tab) {
  const discovering = tab === 'discover';
  document.getElementById('feed-manager-manage-panel').hidden = discovering;
  document.getElementById('feed-manager-discover-panel').hidden = !discovering;
  for (const [name, selected] of [['manage', !discovering], ['discover', discovering]]) {
    const button = document.getElementById(`feed-manager-${name}-tab`);
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
  }
}

function openExplore(query = '') {
  navigateToManager();
  setFeedManagerTab('discover');
  const input = document.getElementById('topic-feed-query');
  input.value = query;
  if (!query) {
    document.getElementById('topic-feed-result').hidden = true;
    document.getElementById('topic-feed-result-query').textContent = '';
    document.getElementById('topic-feed-error').hidden = true;
  }
  renderFeedManager();
  if (query) submitTopicFeed(new Event('submit'));
  requestAnimationFrame(() => input.focus());
}

function profileMenuIsOpen(menuId) {
  return !document.getElementById(menuId).hidden;
}

function setProfileMenuOpen(menuId, buttonId, open) {
  const menu = document.getElementById(menuId);
  const button = document.getElementById(buttonId);
  menu.hidden = !open;
  button.setAttribute('aria-expanded', String(open));
}

function closeProfileMenus() {
  setProfileMenuOpen('profile-menu', 'profile-button', false);
  setProfileMenuOpen('mobile-profile-menu', 'mobile-profile-button', false);
}

function toggleProfileMenu(menuId, buttonId) {
  const open = !profileMenuIsOpen(menuId);
  closeProfileMenus();
  if (open) {
    if (menuId === 'mobile-profile-menu') {
      setMobileMoreOpen(false);
      setMobileFeedsOpen(false);
      setMobileSearchOpen(false);
    }
    setProfileMenuOpen(menuId, buttonId, true);
  }
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
function readerFeeds() {
  return state.auth.user
    ? state.feeds.filter(feed => state.subscriptions.has(feed.id))
    : state.feeds;
}
function readerArticles() {
  if (!state.auth.user) return state.articles;
  return state.articles.filter(article => state.subscriptions.has(article.sourceFeedId));
}
function keyOf(a) { return a.link || ((a.sourceFeedId || a.sourceFeedUrl || '') + '|' + (a.title || '')); }
function articleState(a) { return state.articleStates.get(keyOf(a)); }
function articleStateRequest(a, value) {
  return {
    articleKey: keyOf(a), value,
    title: a.title, link: a.link, publishedAt: a.publishedAt,
    sourceFeedId: a.sourceFeedId, sourceFeedName: a.sourceFeedName,
    sourceFeedUrl: a.sourceFeedUrl, summary: a.summary, imageUrl: a.imageUrl
  };
}
function savedStateToArticle(item) {
  return {
    title: item.title, link: item.link, publishedAt: item.publishedAt,
    sourceFeedId: item.sourceFeedId, sourceFeedName: item.sourceFeedName || '',
    sourceFeedUrl: item.sourceFeedUrl || '', summary: item.summary, imageUrl: item.imageUrl
  };
}
async function markArticleRead(article) {
  if (!state.auth.user) return;
  const response = await api.setArticleRead(articleStateRequest(article, true));
  if (!response.ok) return;
  const item = await response.json().catch(() => null);
  if (item) state.articleStates.set(item.articleKey, item);
  else state.articleStates.delete(keyOf(article));
  renderSidebar();
  renderCards();
}
async function setReadLater(article, value) {
  if (!state.auth.user) return;
  const response = await api.setReadLater(articleStateRequest(article, value));
  if (!response.ok) return;
  const item = await response.json().catch(() => null);
  if (item) state.articleStates.set(item.articleKey, item);
  else state.articleStates.delete(keyOf(article));
  if (value) showSubscriptionToast(t('addedToReadLater'));
  renderSidebar();
  renderCards();
}
async function toggleReadLater(article) {
  if (!state.auth.user) {
    state.auth.pendingReadLaterArticle = article;
    state.auth.pendingSubscriptionId = null;
    state.auth.pendingFeedUrl = null;
    document.getElementById('auth-gate-title').textContent = t('readLater');
    document.getElementById('auth-gate-description').textContent = t('readLaterPrompt');
    document.getElementById('auth-gate-modal').hidden = false;
    return;
  }
  await setReadLater(article, !articleState(article)?.readLaterAt);
}

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

function updateManageFeedLabels() {
  const label = t(state.auth.user ? 'manageDiscoverFeeds' : 'discoverFeeds');
  const arrow = state.lang === 'ar' ? ' ←' : ' →';
  const sidebar = document.getElementById('sidebar-manage-feeds');
  const mobile = document.getElementById('mobile-manage-feeds');
  const title = document.getElementById('feed-manager-title');
  if (sidebar) sidebar.textContent = label + arrow;
  if (mobile) mobile.textContent = label + arrow;
  if (title) title.textContent = label;
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
  const managerSubtitle = document.getElementById('feed-manager-subtitle');
  if (managerSubtitle) managerSubtitle.textContent = state.lang === 'ar' ? 'أضف اشتراكاتك أو ابحث عنها أو احذفها.' : 'Add, find, or remove your subscriptions.';
  const managerBack = document.getElementById('feed-manager-back');
  if (managerBack) managerBack.textContent = state.lang === 'ar' ? 'رجوع →' : '← Back';
  const topicLanguage = document.getElementById('topic-feed-language');
  if (topicLanguage && !topicLanguage.dataset.userSelected) topicLanguage.value = state.lang;
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
  updateAuthUi();
  updateDailyBriefButton();
  try { localStorage.setItem('rss-lang', state.lang); } catch { /* ignore */ }

  if (rerender) {
    renderSidebar();
    renderCards();
    if (window.location.pathname === '/manage-feeds') renderFeedManager();
  }
}

// ---------- AI news brief ----------
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
  const needsFeeds = Boolean(state.auth.user) && state.subscriptions.size === 0;
  for (const id of ['catch-me-up', 'mobile-catch-me-up']) {
    const button = document.getElementById(id);
    if (!button) continue;
    button.disabled = state.dailyBrief.status === 'loading' || needsFeeds;
    button.title = needsFeeds ? t('briefNeedsFeeds') : '';
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

function recentBriefUtcRange() {
  const end = new Date();
  const start = new Date(end.getTime() - (24 * 60 * 60 * 1000));
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
  if (regenerate && !state.auth.user) return;
  if (state.auth.user && state.subscriptions.size === 0) {
    brief.status = 'error';
    brief.error = t('briefNeedsFeeds');
    renderCards();
    return;
  }
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
      ...recentBriefUtcRange(),
      language: requestLanguage,
      regenerate: Boolean(regenerate),
      coverageHours: brief.coverageMode
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
  const generatedFrom = tf('generatedFrom', {
    articles: brief.articleCount,
    feeds: brief.feedCount
  });
  const generatedFromText = document.createElement('span');
  generatedFromText.textContent = `${generatedFrom} · `;
  subtitle.appendChild(generatedFromText);
  if (state.auth.user) {
    const coverageControl = document.createElement('details');
    coverageControl.className = 'daily-brief-coverage-control';
    const coverage = document.createElement('summary');
    coverage.className = 'daily-brief-coverage';
    coverage.setAttribute('aria-label', t('briefCoverage'));
    coverage.textContent = tf('coveringHours', { hours: brief.coverageHours });
    const chevron = document.createElement('span');
    chevron.className = 'daily-brief-coverage-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '\u25be';
    coverage.appendChild(chevron);
    coverageControl.appendChild(coverage);
    const menu = document.createElement('div');
    menu.className = 'daily-brief-coverage-menu';
    const coverageOptions = new Map(
      (brief.coverageOptions || []).map(option => [option.hours, option.articleCount])
    );
    let pendingCoverageHours = brief.coverageHours;
    for (const hours of [6, 12, 24]) {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'daily-brief-coverage-option';
      option.dataset.hours = String(hours);
      option.classList.toggle('active', hours === brief.coverageHours);
      const label = document.createElement('span');
      label.textContent = tf('briefRangeHours', { hours });
      const count = coverageOptions.get(hours) ?? 0;
      const countLabel = document.createElement('span');
      countLabel.className = 'daily-brief-coverage-count';
      countLabel.textContent = count === 1
        ? t('briefRangeArticleCountOne')
        : tf('briefRangeArticleCount', { count });
      option.append(label, countLabel);
      option.addEventListener('click', () => {
        pendingCoverageHours = hours;
        for (const item of menu.querySelectorAll('.daily-brief-coverage-option')) {
          item.classList.toggle('active', Number(item.dataset.hours) === hours);
        }
        regenerateCoverage.disabled = hours === brief.coverageHours || briefState.remainingRegenerations === 0;
      });
      menu.appendChild(option);
    }
    const regenerateCoverage = document.createElement('button');
    regenerateCoverage.type = 'button';
    regenerateCoverage.className = 'daily-brief-coverage-regenerate';
    regenerateCoverage.textContent = t('regenerate');
    regenerateCoverage.disabled = true;
    regenerateCoverage.addEventListener('click', () => {
      coverageControl.open = false;
      briefState.coverageMode = pendingCoverageHours;
      generateDailyBrief(true);
    });
    menu.appendChild(regenerateCoverage);
    coverageControl.appendChild(menu);
    const resetPendingCoverage = () => {
      pendingCoverageHours = brief.coverageHours;
      for (const item of menu.querySelectorAll('.daily-brief-coverage-option')) {
        item.classList.toggle(
          'active',
          Number(item.dataset.hours) === brief.coverageHours);
      }
      regenerateCoverage.disabled = true;
    };
    const closeCoverageMenu = (event) => {
      if (!coverageControl.contains(event.target)) coverageControl.open = false;
    };
    coverageControl.addEventListener('toggle', () => {
      if (coverageControl.open) {
        window.setTimeout(() => document.addEventListener('click', closeCoverageMenu), 0);
      } else {
        document.removeEventListener('click', closeCoverageMenu);
        resetPendingCoverage();
      }
    });
    subtitle.appendChild(coverageControl);
  } else {
    const coverageText = document.createElement('span');
    coverageText.textContent = tf('coveringHours', { hours: brief.coverageHours });
    subtitle.appendChild(coverageText);
  }
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
  actions.append(copy);
  const footerMessage = document.createElement('div');
  footerMessage.className = 'daily-brief-footer-message';
  if (state.auth.user) {
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
    actions.append(regenerate);
    footerMessage.appendChild(quota);
  }
  if (briefState.notice) {
    const notice = document.createElement('span');
    notice.className = 'daily-brief-limit-notice';
    notice.setAttribute('role', 'status');
    notice.textContent = briefState.notice;
    footerMessage.appendChild(notice);
  }
  footer.append(generatedAt, actions);
  if (footerMessage.childElementCount) footer.append(footerMessage);

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
  if (!['all', 'read-later'].includes(state.selected) && !feedById(state.selected)) state.selected = 'all';
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
  const available = readerFeeds();
  const suggested = available.filter(feed => feed.isSuggested);
  const ordered = [...suggested, ...available.filter(feed => !feed.isSuggested)];
  const visible = (query
    ? ordered.filter(feed => feed.name.toLocaleLowerCase().includes(query))
    : ordered
  ).slice(0, query ? 10 : 6);

  nav.innerHTML = '';
  nav.appendChild(navItem('all', state.auth.user ? t('myFeeds') : t('allFeeds'), readerArticles().length, null));
  if (state.auth.user) {
    const readLaterCount = [...state.articleStates.values()].filter(item => item.readLaterAt).length;
    nav.appendChild(navItem('read-later', t('readLater'), readLaterCount, null));
  }
  if (visible.length) {
    const sectionLabel = document.createElement('p');
    sectionLabel.className = 'sidebar-feed-label';
    sectionLabel.textContent = query
      ? (state.lang === 'ar' ? 'نتائج البحث' : 'Search results')
      : (state.auth.user ? t('myFeeds') : t('suggestedFeeds'));
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
  button.textContent = '⟳ ' + t(['all', 'read-later'].includes(state.selected) ? 'refreshAll' : 'refreshFeed');
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
  const available = readerFeeds();
  const suggested = available.filter(feed => feed.isSuggested);
  const ordered = [...suggested, ...available.filter(feed => !feed.isSuggested)];
  const visible = (query
    ? ordered.filter(feed => feed.name.toLocaleLowerCase().includes(query))
    : ordered
  ).slice(0, query ? 8 : 5);

  list.innerHTML = '';
  if (!query || t('allFeeds').toLocaleLowerCase().includes(query)) {
    list.appendChild(quickFeedButton('all', state.auth.user ? t('myFeeds') : t('allFeeds'), readerArticles().length));
  }
  if (state.auth.user && !query) {
    list.appendChild(quickFeedButton('read-later', t('readLater'), [...state.articleStates.values()].filter(item => item.readLaterAt).length));
  }
  if (visible.length) {
    const label = document.createElement('p');
    label.className = 'mobile-quick-feeds-label';
    label.textContent = query
      ? (state.lang === 'ar' ? 'نتائج البحث' : 'Search results')
      : (state.auth.user ? t('myFeeds') : t('suggestedFeeds'));
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

function renderSubscriptionControls() {
  const button = document.getElementById('feed-subscription-button');
  if (!button) return;
  const feed = state.selected === 'all' ? null : feedById(state.selected);
  button.hidden = !feed;
  if (button.hidden) return;
  const subscribed = isSubscribed(feed.id);
  updateSubscriptionButton(button, subscribed);
  button.onclick = () => requestSubscription(feed.id);
}

function createFeedManagerSection(title, feeds, subscribed, capped = false) {
  const section = document.createElement('details');
  section.className = `feed-manager-section${capped ? ' is-capped' : ''}`;
  section.open = true;

  const heading = document.createElement('summary');
  heading.className = 'feed-manager-section-heading';
  const label = document.createElement('span');
  label.textContent = `${title} (${feeds.length})`;
  const chevron = document.createElement('span');
  chevron.className = 'feed-manager-section-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  heading.append(label, chevron);

  const content = document.createElement('div');
  content.className = 'feed-manager-section-content';
  section.append(heading, content);
  return { section, content, subscribed };
}

function renderFeedManager() {
  const manageList = document.getElementById('feed-manager-manage-list');
  const discoverList = document.getElementById('feed-manager-list');
  const manageQuery = document.getElementById('feed-manager-manage-search').value.trim().toLocaleLowerCase();
  const discoverQuery = document.getElementById('topic-feed-query').value.trim().toLocaleLowerCase();
  const matchesQuery = (feed, query) => !query ||
    feed.name.toLocaleLowerCase().includes(query) ||
    (feed.url || '').toLocaleLowerCase().includes(query);
  const subscribedFeeds = state.auth.user
    ? state.feeds.filter(feed => isSubscribed(feed.id) && matchesQuery(feed, manageQuery))
    : [];
  if (latestSubscriptionId) {
    subscribedFeeds.sort((a, b) => Number(b.id === latestSubscriptionId) - Number(a.id === latestSubscriptionId));
  }
  const suggestedFeeds = state.feeds.filter(feed =>
    feed.isSuggested && !isSubscribed(feed.id) && matchesQuery(feed, discoverQuery)
  );
  const note = document.getElementById('feed-manager-account-note');
  if (note) note.textContent = t(state.auth.user ? 'userManageNote' : 'guestManageNote');

  manageList.innerHTML = '';
  discoverList.innerHTML = '';
  const sections = [
    { target: manageList, ...createFeedManagerSection(t('myFeeds'), subscribedFeeds, true, true) },
    { target: discoverList, ...createFeedManagerSection(t('suggestedFeeds'), suggestedFeeds, false) }
  ];
  for (const managerSection of sections) {
    managerSection.target.append(managerSection.section);
    const feeds = managerSection.subscribed ? subscribedFeeds : suggestedFeeds;
    if (!feeds.length) {
      const empty = document.createElement('p');
      empty.className = 'feed-manager-section-empty';
      empty.textContent = t(managerSection.subscribed ? 'myFeedsEmpty' : 'noSuggestedFeeds');
      managerSection.content.append(empty);
      continue;
    }
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
    const subscription = document.createElement('button');
    subscription.type = 'button';
    subscription.className = `feed-manager-subscribe${managerSection.subscribed ? ' is-remove' : ''}`;
    subscription.textContent = t(managerSection.subscribed ? 'unsubscribe' : 'subscribe');
    subscription.setAttribute('aria-label', subscription.textContent);
    subscription.addEventListener('click', () => requestSubscription(feed.id));
    actions.append(count, subscription);
    item.append(open, actions);
    managerSection.content.appendChild(item);
    }
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
  let list;
  if (state.selected === 'read-later') {
    const current = new Map(state.articles.map(article => [keyOf(article), article]));
    list = [...state.articleStates.values()]
      .filter(item => item.readLaterAt)
      .map(item => current.get(item.articleKey) || savedStateToArticle(item));
  } else {
    list = state.selected === 'all'
      ? readerArticles()
      // Selecting a suggested feed is an explicit preview. Keep My Feeds
      // subscription-only, but allow this feed's articles to be explored
      // before the signed-in user decides to subscribe.
      : state.articles.filter(a => a.sourceFeedId === state.selected);
  }

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
  renderSubscriptionControls();
  const header = document.querySelector('.main-header');
  const viewName = document.getElementById('view-name');
  const isRtlFeed = Boolean(feed && hasRtlText(feed.name));
  const isLtrFeed = Boolean(feed && !hasRtlText(feed.name));
  header.classList.toggle('rtl-feed-view', isRtlFeed);
  header.classList.toggle('ltr-feed-view', isLtrFeed);
  viewName.dir = 'auto';
  viewName.textContent = state.selected === 'read-later'
      ? t('readLater')
      : feed ? feed.name : (state.auth.user ? t('myFeeds') : t('allFeeds'));

  const list = filteredArticles();
  const total = list.length;
  document.getElementById('view-count').textContent = '(' + total + ')';

  const cards = document.getElementById('cards');
  cards.innerHTML = '';

  if (state.dailyBrief.status !== 'idle') {
    cards.appendChild(renderDailyBriefCard());
  }

  if (readerFeeds().length === 0 && state.selected === 'all') {
    if (state.auth.user && state.selected === 'all') {
      viewName.textContent = t('buildMyFeeds');
      document.getElementById('view-count').textContent = '';
      renderSubscriptionOnboarding(cards);
      return;
    }
    const empty = document.createElement('div');
    empty.className = 'state';
    const message = document.createElement('p');
    message.textContent = t('noFeeds');
    empty.appendChild(message);
    if (state.auth.user) {
      const choose = document.createElement('button');
      choose.type = 'button';
      choose.className = 'empty-state-action';
      choose.textContent = t('chooseFeeds');
      choose.addEventListener('click', navigateToManager);
      empty.appendChild(choose);
    }
    cards.appendChild(empty);
    return;
  }
  if (total === 0) {
    const empty = document.createElement('p');
    empty.className = 'state';
    empty.textContent = state.search
      ? t('noArticlesMatch')
      : state.selected === 'read-later'
        ? t('readLaterEmpty')
        : t(state.selected === 'all' ? 'noArticlesYet' : 'noArticlesInFeed');
    cards.appendChild(empty);
    return;
  }

  list.forEach((article, index) => cards.appendChild(renderCard(article, index === 0)));
}

function renderSubscriptionOnboarding(cards) {
  const intro = document.createElement('section');
  intro.className = 'subscription-onboarding-intro';
  const title = document.createElement('h2');
  title.textContent = t('welcomePersonalReader');
  const description = document.createElement('p');
  description.textContent = state.lang === 'ar'
    ? 'ابحث عن موضوع أو منشور لبدء بناء قارئك.'
    : 'Search for a topic or publication.';
  const search = document.createElement('form');
  search.className = 'onboarding-explore-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = state.lang === 'ar' ? 'الذكاء الاصطناعي، بي بي سي، كرة القدم...' : 'AI, BBC, Football...';
  searchInput.setAttribute('aria-label', description.textContent);
  search.addEventListener('submit', event => {
    event.preventDefault();
    openExplore(searchInput.value.trim());
  });
  search.appendChild(searchInput);
  const topics = document.createElement('div');
  topics.className = 'onboarding-topic-chips';
  topics.hidden = true;
  for (const topic of ['Technology', 'Science', 'Football', 'Gaming', 'Business', 'Politics']) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.textContent = topic;
    chip.addEventListener('click', () => openExplore(topic));
    topics.appendChild(chip);
  }
  search.appendChild(topics);
  intro.append(title, description, search);
  searchInput.addEventListener('focus', () => { topics.hidden = false; });
  searchInput.addEventListener('click', () => { topics.hidden = false; });
  cards.appendChild(intro);

  const suggestedHeading = document.createElement('h3');
  suggestedHeading.className = 'onboarding-suggested-heading';
  suggestedHeading.textContent = t('suggestedFeeds');
  cards.appendChild(suggestedHeading);

  for (const feed of state.feeds.filter(item => item.isSuggested)) {
    const card = document.createElement('article');
    card.className = 'card article-card suggested-feed-card';
    if (hasRtlText(feed.name)) card.dir = 'rtl';

    const identity = document.createElement('div');
    identity.className = 'suggested-feed-identity';
    const previewArticle = state.articles.find(article =>
      article.sourceFeedId === feed.id && safeHref(article.imageUrl));
    const avatar = previewArticle
      ? document.createElement('img')
      : document.createElement('span');
    avatar.className = previewArticle
      ? 'suggested-feed-avatar suggested-feed-image'
      : 'suggested-feed-avatar';
    if (previewArticle) {
      avatar.src = safeHref(previewArticle.imageUrl);
      avatar.alt = '';
      avatar.loading = 'lazy';
      avatar.referrerPolicy = 'no-referrer';
      avatar.addEventListener('error', () => {
        const fallback = document.createElement('span');
        fallback.className = 'suggested-feed-avatar';
        fallback.textContent = feed.name.trim().charAt(0).toLocaleUpperCase();
        avatar.replaceWith(fallback);
      });
    } else {
      avatar.textContent = feed.name.trim().charAt(0).toLocaleUpperCase();
    }
    const details = document.createElement('div');
    const name = document.createElement('h3');
    name.dir = 'auto';
    name.textContent = feed.name;
    const meta = document.createElement('p');
    const language = (feed.language || '').toLocaleUpperCase();
    meta.textContent = [feed.category, language].filter(Boolean).join(' · ');
    details.append(name, meta);
    identity.append(avatar, details);

    const available = document.createElement('p');
    available.className = 'suggested-feed-available';
    available.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    available.textContent = tf('articlesAvailable', { count: countFor(feed.id) });
    const subscribe = document.createElement('button');
    subscribe.type = 'button';
    subscribe.className = 'suggested-feed-subscribe';
    subscribe.textContent = t('subscribe');
    subscribe.addEventListener('click', async () => {
      subscribe.disabled = true;
      await subscribeToFeed(feed.id);
      subscribe.disabled = false;
    });
    card.append(identity, available, subscribe);
    cards.appendChild(card);
  }
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
  const savedState = articleState(a);
  if (savedState?.readAt) card.classList.add('is-read');

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

  const readLater = document.createElement('button');
  readLater.type = 'button';
  readLater.className = 'bookmark-button';
  readLater.classList.toggle('active', Boolean(savedState?.readLaterAt));
  readLater.setAttribute('aria-label', t(savedState?.readLaterAt ? 'removeFromReadLater' : 'addToReadLater'));
  readLater.title = readLater.getAttribute('aria-label');
  readLater.innerHTML = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>';
  readLater.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleReadLater(a);
  });

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
  card.appendChild(readLater);
  card.appendChild(cardMain);
  card.addEventListener('click', () => openArticle(a));

  return card;
}

// Open the full article at its source (feeds usually only carry a summary).
// Falls back to the in-app modal for the rare article with no link.
function openArticle(a) {
  if (state.auth.user) markArticleRead(a);
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
  if (open) closeProfileMenus();
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
  if (open) closeProfileMenus();
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
  if (open) closeProfileMenus();
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
  if (['all', 'read-later'].includes(key)) return refreshAllArticles();
  if (feedRefreshPromises.has(key)) return feedRefreshPromises.get(key);
  const promise = (async () => {
    await api.refreshFeed(key);
    await reloadArticles();
  })().finally(() => feedRefreshPromises.delete(key));
  feedRefreshPromises.set(key, promise);
  return promise;
}

function clearArticleSearch() {
  state.search = '';
  document.getElementById('search').value = '';
  document.getElementById('mobile-search').value = '';
  setMobileSearchOpen(false);
}

function selectFeedAndScroll(key) {
  if (state.selected !== key) clearArticleSearch();
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
document.getElementById('sidebar-follow-topic').addEventListener('click', () => openExplore());
document.getElementById('mobile-follow-topic').addEventListener('click', () => {
  setMobileFeedsOpen(false);
  openExplore();
});
document.getElementById('feed-manager-add').addEventListener('submit', submitCustomFeed);
document.getElementById('topic-feed-form').addEventListener('submit', submitTopicFeed);
let exploreSearchTimer = null;
document.getElementById('topic-feed-query').addEventListener('input', event => {
  clearTimeout(exploreSearchTimer);
  document.getElementById('topic-feed-error').hidden = true;
  renderFeedManager();
  const query = event.currentTarget.value.trim();
  if (!query) {
    document.getElementById('topic-feed-result').hidden = true;
    return;
  }
  exploreSearchTimer = setTimeout(() => submitTopicFeed(new Event('submit')), 220);
});
document.getElementById('topic-feed-submit').addEventListener('click', followTopicFeed);
document.getElementById('topic-feed-preview').addEventListener('click', previewTopicFeed);
document.getElementById('topic-feed-change').addEventListener('click', () => {
  const settings = document.getElementById('topic-feed-settings');
  settings.hidden = !settings.hidden;
});
document.getElementById('topic-feed-language').addEventListener('change', event => {
  event.currentTarget.dataset.userSelected = 'true';
  updateTopicLocaleSummary();
});
document.getElementById('topic-feed-country').addEventListener('change', updateTopicLocaleSummary);
document.getElementById('feed-manager-manage-tab').addEventListener('click', () => setFeedManagerTab('manage'));
document.getElementById('feed-manager-discover-tab').addEventListener('click', () => setFeedManagerTab('discover'));

document.getElementById('refresh-all').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const selected = state.selected;
  btn.disabled = true;
  btn.textContent = '⟳ ' + t(['all', 'read-later'].includes(selected) ? 'refreshingAll' : 'refreshingFeed');
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
  if (window.location.pathname === '/manage-feeds') return;
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
document.getElementById('feed-manager-manage-search').addEventListener('input', renderFeedManager);
window.addEventListener('popstate', applyRoute);

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
window.addEventListener('pageshow', () => {
  document.getElementById('auth-google').disabled = false;
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);
document.getElementById('profile-button').addEventListener('click', (event) => {
  event.stopPropagation();
  toggleProfileMenu('profile-menu', 'profile-button');
});
document.getElementById('mobile-profile-button').addEventListener('click', (event) => {
  event.stopPropagation();
  toggleProfileMenu('mobile-profile-menu', 'mobile-profile-button');
});
for (const menu of document.querySelectorAll('.profile-menu')) {
  menu.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-auth-action]')?.dataset.authAction;
    if (action === 'login' || action === 'register') openAuthModal(action);
    if (action === 'logout') await logout();
  });
}
document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);
document.getElementById('auth-modal-backdrop').addEventListener('click', closeAuthModal);
document.getElementById('auth-gate-close').addEventListener('click', () => closeSubscriptionPrompt());
document.getElementById('auth-gate-backdrop').addEventListener('click', () => closeSubscriptionPrompt());
document.getElementById('auth-gate-dismiss').addEventListener('click', () => closeSubscriptionPrompt());
document.getElementById('auth-gate-login').addEventListener('click', () => {
  closeSubscriptionPrompt(false);
  openAuthModal('login');
});
document.getElementById('auth-gate-register').addEventListener('click', () => {
  closeSubscriptionPrompt(false);
  openAuthModal('register');
});
document.getElementById('auth-switch').addEventListener('click', () => {
  state.auth.mode = state.auth.mode === 'register' ? 'login' : 'register';
  document.getElementById('auth-error').hidden = true;
  updateAuthModalText();
});
document.getElementById('auth-form').addEventListener('submit', submitAuthForm);
document.getElementById('auth-verify-form').addEventListener('submit', submitVerificationForm);
document.getElementById('auth-resend').addEventListener('click', resendVerificationCode);
const authCodeInputs = [...document.querySelectorAll('.auth-code-input')];
for (const [index, input] of authCodeInputs.entries()) {
  input.addEventListener('input', event => {
    const digits = event.target.value.replace(/\D/g, '');
    if (digits.length > 1) {
      digits.slice(0, 6).split('').forEach((digit, offset) => {
        if (authCodeInputs[index + offset]) authCodeInputs[index + offset].value = digit;
      });
      authCodeInputs[Math.min(index + digits.length, 5)].focus();
      return;
    }
    event.target.value = digits;
    if (digits && authCodeInputs[index + 1]) authCodeInputs[index + 1].focus();
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Backspace' && !input.value && authCodeInputs[index - 1]) {
      authCodeInputs[index - 1].focus();
    }
    if (event.key === 'ArrowLeft' && authCodeInputs[index - 1]) authCodeInputs[index - 1].focus();
    if (event.key === 'ArrowRight' && authCodeInputs[index + 1]) authCodeInputs[index + 1].focus();
  });
  input.addEventListener('paste', event => {
    const digits = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    event.preventDefault();
    digits.split('').forEach((digit, offset) => {
      if (authCodeInputs[index + offset]) authCodeInputs[index + offset].value = digit;
    });
    authCodeInputs[Math.min(index + digits.length - 1, 5)].focus();
  });
}
document.getElementById('auth-google').addEventListener('click', beginGoogleSignIn);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeModal();
  closeAuthModal();
  closeSubscriptionPrompt();
  closeProfileMenus();
  if (mobileSearchIsOpen()) setMobileSearchOpen(false);
  if (mobileMoreIsOpen()) setMobileMoreOpen(false);
  if (mobileFeedsIsOpen()) setMobileFeedsOpen(false);
});

document.addEventListener('click', (e) => {
  for (const [menuId, buttonId] of [
    ['profile-menu', 'profile-button'],
    ['mobile-profile-menu', 'mobile-profile-button'],
  ]) {
    const menu = document.getElementById(menuId);
    const button = document.getElementById(buttonId);
    if (!menu.hidden && !menu.contains(e.target) && !button.contains(e.target)) {
      setProfileMenuOpen(menuId, buttonId, false);
    }
  }
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
(async function init() {
  let theme = 'light';
  let lang = 'en';
  try { theme = localStorage.getItem('rss-theme') || 'light'; } catch { /* ignore */ }
  try { lang = localStorage.getItem('rss-lang') || 'en'; } catch { /* ignore */ }
  applyTheme(theme);
  applyLanguage(lang, false);
  updateScrollTopButton();
  applyRoute();
  await loadAuthState();
  await loadAll();
  await restorePendingAuthAction();
  showGoogleAuthError();
})();
