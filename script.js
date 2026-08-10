const blogKeywordMatches = globalThis.BLOG_NEUROSYMBOLIC_MATCHES || {};
const companyFocus = globalThis.COMPANY_FOCUS || null;
const companyVerification = globalThis.COMPANY_VERIFICATION?.companies || {};

const organizations = Array.isArray(globalThis.COMPANY_DIRECTORY)
  ? globalThis.COMPANY_DIRECTORY
  : [];

const PAPER_DATA_URL = 'data/research-papers.json';
const ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@6/dist/echarts.min.js';
let arxivPapers = [];
let arxivPapersMeta = { keywords: [], generatedAt: '', yearRange: null };
let paperDataStatus = 'idle';
let paperDataPromise = null;
let echartsPromise = null;

const booksLibrary = globalThis.BOOKS_LIBRARY || { sections: [], updatedAt: '' };
const bookSections = Array.isArray(booksLibrary.sections) ? booksLibrary.sections : [];
const allBooks = bookSections.flatMap((section) => section.books || []);
const communityLibrary = globalThis.NESY_COMMUNITY || { sections: [], updatedAt: '' };
const communitySections = Array.isArray(communityLibrary.sections) ? communityLibrary.sections : [];
const allCommunityItems = communitySections.flatMap((section) => section.items || []);

const state = {
  activeView: 'directory',
  query: '',
  country: '',
  sortKey: 'name',
  sortDirection: 'asc',
  blogCompanies: new Set(),
  blogTypes: new Set(),
  blogNeurosymbolicOnly: false,
  paperQuery: '',
  paperSort: 'newest',
  paperLimit: 50,
  paperYears: new Set(),
  paperConferences: new Set(),
  paperAuthors: new Set(),
  paperInstitutions: new Set(),
  paperAuthorQuery: '',
  paperInstitutionQuery: '',
  bookQuery: '',
  communityQuery: ''
};

const elements = {
  tbody: document.querySelector('#company-table tbody'),
  search: document.querySelector('#search'),
  count: document.querySelector('#org-count'),
  summaryLabel: document.querySelector('#summary-label'),
  clearSearch: document.querySelector('#clear-search'),
  empty: document.querySelector('#empty-state'),
  sortableHeaders: [...document.querySelectorAll('th.sortable')],
  modal: document.querySelector('#modal'),
  close: document.querySelector('#close'),
  methodLinks: [document.querySelector('#footer-method-link')],
  verificationModal: document.querySelector('#verification-modal'),
  verificationContent: document.querySelector('#verification-content'),
  verificationClose: document.querySelector('#verification-close'),
  verificationMethodLink: document.querySelector('#verification-method-link'),
  navDirectory: document.querySelector('#nav-directory'),
  navBlogs: document.querySelector('#nav-blogs'),
  navPapers: document.querySelector('#nav-papers'),
  directoryView: document.querySelector('#directory-view'),
  blogsView: document.querySelector('#blogs-view'),
  papersView: document.querySelector('#papers-view'),
  blogsList: document.querySelector('#blogs-list'),
  blogCompanyFilters: document.querySelector('#blog-company-filters'),
  blogTypeFilters: document.querySelector('#blog-type-filters'),
  blogNeurosymbolicToggle: document.querySelector('#blog-neurosymbolic-toggle'),
  clearBlogFilters: document.querySelector('#clear-blog-filters'),
  blogFilters: document.querySelector('.blog-filters'),
  blogFilterToggle: document.querySelector('#blog-filter-toggle'),
  focusReport: document.querySelector('#focus-report'),
  focusReportInner: document.querySelector('#focus-report .focus-report-inner'),
  focusReportToggle: document.querySelector('#focus-report-toggle'),
  focusReportBackLinks: [...document.querySelectorAll('.focus-report-back')],
  blogResultsCount: document.querySelector('#blog-results-count'),
  blogsEmpty: document.querySelector('#blogs-empty'),
  postsTimelineRange: document.querySelector('#posts-timeline-range'),
  paperKeywordList: document.querySelector('#paper-keyword-list'),
  paperYearFilters: document.querySelector('#paper-year-filters'),
  paperConferenceFilters: document.querySelector('#paper-conference-filters'),
  paperAuthorSearch: document.querySelector('#paper-author-search'),
  paperAuthorFilters: document.querySelector('#paper-author-filters'),
  paperInstitutionSearch: document.querySelector('#paper-institution-search'),
  paperInstitutionFilters: document.querySelector('#paper-institution-filters'),
  clearPaperFilters: document.querySelector('#clear-paper-filters'),
  paperFilterPanel: document.querySelector('.paper-filter-panel'),
  paperFilterToggle: document.querySelector('#paper-filter-toggle'),
  paperLoadStatus: document.querySelector('#paper-load-status'),
  papersUpdated: document.querySelector('#papers-updated'),
  papersResultsCount: document.querySelector('#papers-results-count'),
  papersSort: document.querySelector('#papers-sort'),
  papersList: document.querySelector('#papers-list'),
  papersEmpty: document.querySelector('#papers-empty'),
  papersLoadMore: document.querySelector('#papers-load-more'),
  paperMethodButton: document.querySelector('#paper-method-button'),
  paperMethodModal: document.querySelector('#paper-method-modal'),
  paperMethodClose: document.querySelector('#paper-method-close'),
  navBooks: document.querySelector('#nav-books'),
  booksView: document.querySelector('#books-view'),
  booksUpdated: document.querySelector('#books-updated'),
  booksToc: document.querySelector('.books-toc'),
  booksSections: document.querySelector('#books-sections'),
  booksEmpty: document.querySelector('#books-empty'),
  navCommunity: document.querySelector('#nav-community'),
  communityView: document.querySelector('#community-view'),
  communityUpdated: document.querySelector('#community-updated'),
  communitySections: document.querySelector('#community-sections'),
  communityEmpty: document.querySelector('#community-empty')
};

const externalIcon = `
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const calendarIcon = `
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 2v4M16 2v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <rect width="18" height="18" x="3" y="4" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
    <path d="M3 10h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const conferenceIcon = `
  <svg class="paper-conference-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 6.25 8 2l6 4.25M3.5 6.5v5.25M6.5 6.5v5.25M9.5 6.5v5.25M12.5 6.5v5.25M2 12h12M1.5 14h13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const POST_TIMELINE_END_MONTH = localIsoDate().slice(0, 7);
const postTimelineStartDate = new Date(`${POST_TIMELINE_END_MONTH}-01T00:00:00Z`);
postTimelineStartDate.setUTCMonth(postTimelineStartDate.getUTCMonth() - 11);
const POST_TIMELINE_START_MONTH = postTimelineStartDate.toISOString().slice(0, 7);

const linkedinIcon = `
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 17.34V9.67H5.79v7.67h2.55M7.07 8.57a1.48 1.48 0 1 0-.01-2.96 1.48 1.48 0 0 0 .01 2.96m11.14 8.77v-4.21c0-2.25-1.2-3.29-2.83-3.29a2.8 2.8 0 0 0-2.55 1.4V9.67h-2.55v7.67h2.55v-3.8c0-1 .19-1.97 1.43-1.97s1.24 1.14 1.24 2.04v3.73h2.71Z"></path>
  </svg>`;

const verificationIcon = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3 19 6v5.2c0 4.2-2.8 7.9-7 9.8-4.2-1.9-7-5.6-7-9.8V6l7-3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
    <path d="m8.6 12 2.1 2.1 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const githubIcon = `
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.37 9.37 0 0 1 12 6.96c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.23 10.23 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
  </svg>`;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function searchableText(organization) {
  return [
    organization.name,
    organization.ceoName,
    organization.founded,
    organization.product,
    organization.github,
    organization.githubTopRepo,
    organization.location,
    organization.funding,
    organization.postTitle,
    organization.postDate
  ].join(' ').toLowerCase();
}

function locationCountry(location) {
  if (!location || location === 'Not disclosed') return '';
  return location.split(',').at(-1).trim();
}

function matchingOrganizations() {
  const query = state.query.trim().toLowerCase();
  const matches = organizations.filter((organization) => {
    if (state.country && locationCountry(organization.location) !== state.country) return false;
    return !query || searchableText(organization).includes(query);
  });

  return matches.sort((a, b) => {
    const aValue = state.sortKey === 'postCount' ? datedPostCount(a) : a[state.sortKey] ?? '';
    const bValue = state.sortKey === 'postCount' ? datedPostCount(b) : b[state.sortKey] ?? '';

    const comparison = String(aValue).localeCompare(
      String(bValue),
      undefined,
      { sensitivity: 'base', numeric: true }
    );
    return state.sortDirection === 'asc' ? comparison : -comparison;
  });
}

function fundingTemplate(organization) {
  const label = escapeHtml(organization.funding);
  if (!organization.fundingUrl) return `<span class="muted-value">${label}</span>`;
  return `<a class="value-link" href="${escapeHtml(organization.fundingUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function githubRepoName(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).at(-1)) || 'Repository';
  } catch {
    return 'Repository';
  }
}

function githubTemplate(organization) {
  if (!organization.github) return '<span class="muted-value">–</span>';
  const organizationLink = `<a class="github-link" href="${escapeHtml(organization.github)}" target="_blank" rel="noopener noreferrer" title="Open ${escapeHtml(organization.name)} on GitHub" aria-label="${escapeHtml(organization.name)} on GitHub">${githubIcon}</a>`;
  if (!organization.githubTopRepo) {
    return `<span class="github-summary">${organizationLink}<span class="muted-value" title="No public repositories found">–</span></span>`;
  }

  const stars = Number(organization.githubStars) || 0;
  const repoName = githubRepoName(organization.githubTopRepo);
  return `
    <span class="github-summary">
      ${organizationLink}
      <a class="github-repo-link" href="${escapeHtml(organization.githubTopRepo)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(repoName)}, ${stars.toLocaleString('en-US')} GitHub stars" title="Open ${escapeHtml(repoName)}">
        <span class="github-repo-name">${escapeHtml(repoName)}</span>
        <span class="github-stars"><span aria-hidden="true">★</span>${stars.toLocaleString('en-US')}</span>
      </a>
    </span>`;
}

function productTemplate(organization) {
  if (!organization.product) return '<span class="muted-value">–</span>';
  const label = escapeHtml(organization.product);
  if (!organization.productUrl) return label;
  return `<a class="value-link" href="${escapeHtml(organization.productUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function locationTemplate(location) {
  const country = locationCountry(location);
  if (!country) return escapeHtml(location);
  const selected = state.country === country;
  const action = selected ? 'Clear' : 'Filter by';
  return `<button class="location-filter" type="button" data-country-filter="${escapeHtml(country)}" aria-pressed="${selected}" aria-label="${action} ${escapeHtml(country)}">${escapeHtml(location)}</button>`;
}

function ceoTemplate(organization) {
  if (!organization.ceoName) return '<span class="muted-value">–</span>';
  if (!organization.ceoLinkedin) return `<span>${escapeHtml(organization.ceoName)}</span>`;
  return `<a class="ceo-link" href="${escapeHtml(organization.ceoLinkedin)}" target="_blank" rel="noopener noreferrer">
    <span>${escapeHtml(organization.ceoName)}</span>${externalIcon}
  </a>`;
}

function formatPostDate(date) {
  if (!date) return 'Undated';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T00:00:00`));
}

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function datedPostCount(organization) {
  return [...postMonthCounts(organization).values()]
    .reduce((total, count) => total + count, 0);
}

function postMonthCounts(organization) {
  return postsForOrganization(organization).reduce((counts, post) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return counts;
    const month = post.date.slice(0, 7);
    if (month < POST_TIMELINE_START_MONTH || month > POST_TIMELINE_END_MONTH) return counts;
    counts.set(month, (counts.get(month) || 0) + 1);
    return counts;
  }, new Map());
}

function formatTimelineMonth(month) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${month}-01T00:00:00Z`));
}

function buildPostTimeline() {
  const [startYear, startMonth] = POST_TIMELINE_START_MONTH.split('-').map(Number);
  const [endYear, endMonth] = POST_TIMELINE_END_MONTH.split('-').map(Number);
  const months = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, '0')}`);
    month += 1;
    if (month === 13) {
      month = 1;
      year += 1;
    }
  }

  const maxMonthlyPosts = Math.max(
    1,
    ...organizations.flatMap((organization) => [...postMonthCounts(organization).values()])
  );
  return { months, maxMonthlyPosts };
}

const postTimeline = buildPostTimeline();

function postActivityTemplate(organization) {
  const count = datedPostCount(organization);
  if (count === 0) return '<span class="muted-value">–</span>';
  const counts = postMonthCounts(organization);
  const startLabel = formatTimelineMonth(postTimeline.months[0]);
  const endLabel = formatTimelineMonth(postTimeline.months.at(-1));
  const peakCount = Math.max(...postTimeline.months.map((month) => counts.get(month) || 0));
  const peakMonth = [...postTimeline.months].reverse().find((month) => (counts.get(month) || 0) === peakCount);
  const bars = postTimeline.months.map((month) => {
    const monthlyCount = counts.get(month) || 0;
    if (monthlyCount === 0) return '<span class="post-activity-bar is-empty" aria-hidden="true"></span>';
    const height = Math.max(
      14,
      Math.round(Math.sqrt(monthlyCount / postTimeline.maxMonthlyPosts) * 100)
    );
    const label = `${formatTimelineMonth(month)}: ${monthlyCount} ${monthlyCount === 1 ? 'post' : 'posts'}`;
    return `<span class="post-activity-bar${month === peakMonth ? ' is-peak' : ''}" style="--activity-height:${height}%" title="${escapeHtml(label)}" aria-hidden="true"></span>`;
  }).join('');
  const ariaLabel = `${organization.name}: ${count} dated ${count === 1 ? 'post' : 'posts'} from ${startLabel} through ${endLabel}`;
  return `<span class="post-activity-chart" role="img" aria-label="${escapeHtml(ariaLabel)}"><span class="post-activity-bars" style="--month-count:${postTimeline.months.length}">${bars}</span></span>`;
}

function rowTemplate(organization) {
  const favicon = organization.favicon
    ? `<img class="company-favicon" src="${escapeHtml(organization.favicon)}" alt="" loading="lazy" />`
    : '';
  const linkedin = organization.linkedin
    ? `<a class="company-linkedin" href="${escapeHtml(organization.linkedin)}" target="_blank" rel="noopener noreferrer" title="Open ${escapeHtml(organization.name)} on LinkedIn" aria-label="${escapeHtml(organization.name)} on LinkedIn">${linkedinIcon}</a>`
    : '';
  const verification = companyVerification[organization.name]
    ? `<button class="company-verification" type="button" data-verification-company="${escapeHtml(organization.name)}" title="Why ${escapeHtml(organization.name)} is included" aria-label="View inclusion evidence for ${escapeHtml(organization.name)}">${verificationIcon}</button>`
    : '';

  return `
    <tr>
      <td class="sticky-name-column">
        <div class="database-cell">
          <span class="company-icon" aria-hidden="true">
            ${escapeHtml(organization.initials)}
            ${favicon}
          </span>
          <span class="company-title">
            <a class="company-homepage" href="${escapeHtml(organization.website)}" target="_blank" rel="noopener noreferrer" title="Open ${escapeHtml(organization.name)} homepage">${escapeHtml(organization.name)}</a>
            ${linkedin}
            ${verification}
          </span>
        </div>
      </td>
      <td class="github-cell">${githubTemplate(organization)}</td>
      <td>${ceoTemplate(organization)}</td>
      <td>${organization.founded ? escapeHtml(organization.founded) : '<span class="muted-value">–</span>'}</td>
      <td>${productTemplate(organization)}</td>
      <td>${locationTemplate(organization.location)}</td>
      <td>${fundingTemplate(organization)}</td>
      <td class="post-activity-cell">${postActivityTemplate(organization)}</td>
    </tr>`;
}

function updateSortIndicators() {
  elements.sortableHeaders.forEach((header) => {
    const indicator = header.querySelector('.sort-indicator');
    if (!indicator) return;
    const isSorted = header.dataset.key === state.sortKey;
    indicator.textContent = isSorted
      ? state.sortDirection === 'asc' ? '↑' : '↓'
      : '';
    header.classList.toggle('is-sorted', isSorted);
    header.setAttribute('aria-sort', isSorted
      ? state.sortDirection === 'asc' ? 'ascending' : 'descending'
      : 'none');
  });
}

function render() {
  const matches = matchingOrganizations();
  elements.tbody.innerHTML = matches.map(rowTemplate).join('');
  elements.tbody.querySelectorAll?.('.company-favicon').forEach((image) => {
    image.addEventListener('error', () => image.remove());
  });
  elements.count.textContent = matches.length === organizations.length
    ? String(organizations.length)
    : `${matches.length} / ${organizations.length}`;
  elements.summaryLabel.textContent = 'NeSy companies';
  elements.clearSearch.hidden = !state.query && !state.country;
  elements.empty.hidden = matches.length !== 0;
  if (postTimeline.months.length > 0) {
    elements.postsTimelineRange.textContent = `${formatTimelineMonth(postTimeline.months[0])}–${formatTimelineMonth(postTimeline.months.at(-1))}`;
  }
  updateSortIndicators();
}

function postsForOrganization(organization) {
  if (organization.posts && organization.posts.length) return organization.posts;
  if (organization.postUrl && organization.postTitle) {
    return [{ title: organization.postTitle, date: organization.postDate, url: organization.postUrl }];
  }
  return [];
}

function allPosts() {
  const flattened = [];

  organizations.forEach((organization) => {
    postsForOrganization(organization).forEach((post) => {
      flattened.push({
        organization,
        title: post.title,
        date: post.date,
        type: post.type,
        url: post.url,
        excerpt: post.excerpt || '',
        summary: post.summary || '',
        description: post.description || '',
        content: post.content || '',
        neurosymbolicMatch: blogKeywordMatches[post.url] === true || post.neurosymbolicMatch === true
      });
    });
  });

  return flattened.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

const neurosymbolicPostPattern = /\b(?:neuro[\s-]?symbolic|neural[\s-]+symbolic|nesy)\b/i;

function postHasNeurosymbolicKeyword(post) {
  return post.neurosymbolicMatch === true || neurosymbolicPostPattern.test([
    post.title,
    post.excerpt,
    post.summary,
    post.description,
    post.content
  ].filter(Boolean).join(' '));
}

function syncBlogNeurosymbolicToggle() {
  elements.blogNeurosymbolicToggle.setAttribute('aria-checked', String(state.blogNeurosymbolicOnly));
  elements.blogNeurosymbolicToggle.querySelector('.blog-keyword-toggle__state').textContent = state.blogNeurosymbolicOnly
    ? 'On'
    : 'Off';
}

function postType(post) {
  const explicitType = String(post.type || '').toLowerCase();
  const supportedTypes = new Map([
    ['blog', 'Blog'],
    ['news', 'News'],
    ['research', 'Research'],
    ['paper', 'Paper'],
    ['white paper', 'White Paper'],
    ['whitepaper', 'White Paper'],
    ['white-paper', 'White Paper']
  ]);
  if (supportedTypes.has(explicitType)) return supportedTypes.get(explicitType);

  let url;
  try {
    url = new URL(post.url);
  } catch {
    return 'Blog';
  }

  const location = `${url.hostname}${url.pathname}`.toLowerCase();
  const title = post.title.toLowerCase();
  if (
    /\/white-?papers?(?:\/|$)/.test(url.pathname.toLowerCase())
    || /\b(?:white paper|whitepaper)\b/.test(title)
  ) return 'White Paper';
  if (
    /^(?:www\.)?arxiv\.org$/.test(url.hostname)
    || /\/papers?(?:\/|$)/.test(url.pathname.toLowerCase())
    || /\bresearch paper\b/.test(title)
    || /\.pdf$/i.test(url.pathname)
  ) return 'Paper';
  if (/\/(?:research|technical-insights)(?:\/|$)/.test(url.pathname.toLowerCase())) return 'Research';
  if (/\/(?:news|newsroom|press|press-releases?)(?:\/|$)/.test(url.pathname.toLowerCase())) return 'News';
  if (/\b(?:newsroom|press-release)\b/.test(location)) return 'News';
  return 'Blog';
}

function postTypeClass(type) {
  return type.toLowerCase().replace(/\s+/g, '-');
}

function blogFilterTemplate(organization, index) {
  const favicon = organization.favicon
    ? `<img class="company-favicon" src="${escapeHtml(organization.favicon)}" alt="" loading="lazy" />`
    : '';
  const postCount = postsForOrganization(organization).length;

  return `
    <li>
      <label class="blog-company-filter" for="blog-company-${index}">
        <input id="blog-company-${index}" type="checkbox" data-blog-company="${escapeHtml(organization.name)}" />
        <span class="company-icon" aria-hidden="true">
          ${escapeHtml(organization.initials)}
          ${favicon}
        </span>
        <span class="blog-company-filter-name">${escapeHtml(organization.name)}</span>
        <span class="blog-company-filter-count">${postCount}</span>
      </label>
    </li>`;
}

function blogTypeFilterTemplate(type, count) {
  const typeClass = postTypeClass(type);
  return `
    <li>
      <label class="blog-type-filter">
        <input type="checkbox" data-blog-type="${escapeHtml(type)}" />
        <span class="blog-type-filter-swatch blog-type-filter-swatch--${typeClass}" aria-hidden="true"></span>
        <span class="blog-type-filter-name">${escapeHtml(type)}</span>
        <span class="blog-company-filter-count">${count}</span>
      </label>
    </li>`;
}

function renderBlogFilters() {
  const companiesWithPosts = organizations
    .filter((organization) => postsForOrganization(organization).length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  elements.blogCompanyFilters.innerHTML = companiesWithPosts
    .map(blogFilterTemplate)
    .join('');
  elements.blogCompanyFilters.querySelectorAll('.company-favicon').forEach((image) => {
    image.addEventListener('error', () => image.remove());
  });

  const types = ['Blog', 'News', 'Research', 'Paper', 'White Paper'];
  const posts = allPosts();
  elements.blogTypeFilters.innerHTML = types
    .map((type) => blogTypeFilterTemplate(
      type,
      posts.filter((post) => postType(post) === type).length
    ))
    .join('');
  syncBlogNeurosymbolicToggle();
}

function blogItemTemplate(post, today) {
  const organization = post.organization;
  const favicon = organization.favicon
    ? `<img class="company-favicon" src="${escapeHtml(organization.favicon)}" alt="" loading="lazy" />`
    : '';
  const date = formatPostDate(post.date);
  const type = postType(post);
  const typeClass = postTypeClass(type);

  return `
    <li class="blog-card${post.date === today ? ' is-today' : ''}">
      <a class="blog-card-link" href="${escapeHtml(post.url)}" target="_blank" rel="noopener noreferrer">
        <span class="blog-card-header">
          <span class="blog-card-company">
            <span class="company-icon" aria-hidden="true">
              ${escapeHtml(organization.initials)}
              ${favicon}
            </span>
            <span>${escapeHtml(organization.name)}</span>
          </span>
          <span class="blog-card-external" aria-hidden="true">${externalIcon}</span>
        </span>
        <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
        <span class="blog-card-meta">
          <span class="blog-card-date">${calendarIcon}${escapeHtml(date)}</span>
          <span class="blog-card-type blog-card-type--${typeClass}">${escapeHtml(type)}</span>
        </span>
      </a>
    </li>`;
}

function groupPostsByPeriod(posts) {
  return posts.reduce((groups, post) => {
    const key = post.date ? post.date.slice(0, 7) : 'undated';
    const current = groups.at(-1);
    if (!current || current.key !== key) groups.push({ key, posts: [] });
    groups.at(-1).posts.push(post);
    return groups;
  }, []);
}

function blogPeriodTemplate(period, today) {
  const firstPost = period.posts[0];
  const [year, month] = firstPost.date ? firstPost.date.split('-') : ['', ''];
  const label = firstPost.date
    ? `<span class="blog-timeline-year">${escapeHtml(year)}</span><span class="blog-timeline-month">${monthNames[Number(month) - 1]}</span>`
    : '<span class="blog-timeline-month">Undated</span>';

  return `
    <li class="blog-period">
      <div class="blog-period-timeline" aria-hidden="true">
        <div class="blog-period-label">${label}</div>
      </div>
      <ul class="blog-period-posts">
        ${period.posts.map((post) => blogItemTemplate(post, today)).join('')}
      </ul>
    </li>`;
}

function renderBlogs() {
  const posts = allPosts().filter((post) => {
    const matchesCompany = state.blogCompanies.size === 0
      || state.blogCompanies.has(post.organization.name);
    const matchesType = state.blogTypes.size === 0
      || state.blogTypes.has(postType(post));
    const matchesNeurosymbolic = !state.blogNeurosymbolicOnly
      || postHasNeurosymbolicKeyword(post);
    return matchesCompany && matchesType && matchesNeurosymbolic;
  });
  const today = localIsoDate();

  elements.blogsList.innerHTML = groupPostsByPeriod(posts)
    .map((period) => blogPeriodTemplate(period, today))
    .join('');
  elements.blogsList.querySelectorAll('.company-favicon').forEach((image) => {
    image.addEventListener('error', () => image.remove());
  });
  elements.blogResultsCount.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
  elements.blogsEmpty.hidden = posts.length !== 0;
  elements.clearBlogFilters.hidden = state.blogCompanies.size === 0
    && state.blogTypes.size === 0
    && !state.blogNeurosymbolicOnly;
}

const FOCUS_MIN_POSTS = 3;
const FOCUS_TREND_START = '2023-H1';
const FOCUS_PANEL_MIN_POSTS = 4;

/*
 * Lieflat template audit for this report:
 * - Ranked shares: F5 Tick Rows keeps long labels readable; F1 was rejected because
 *   vertical labels would crowd, and L2 because 17 long category names exceed its cascade contract.
 * - Independent blog-theme percentages: L15 Ballot Tally makes the non-additive denominator explicit;
 *   L14 incorrectly implies a 100% composition, while F5 is less explicit about multi-select semantics.
 * - Time: F1 Rung Bars makes publisher counts honestly countable; F2 Hairline Line carries the
 *   small-multiple trajectories. F3 was rejected because seven half-years are too sparse for an area texture.
 * - Signed shifts: G10 Diverging Bar is the only exact contract. F9 is a sequential waterfall and
 *   F12 is a two-endpoint comparison, so neither represents independent positive/negative categories.
 * The entire delivery is locked to the Wire palette: grayscale carries data and orange marks one protagonist.
 */

function focusPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function focusPeriodOf(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getUTCFullYear()}-H${parsed.getUTCMonth() < 6 ? 1 : 2}`;
}

function focusYearTotals(company, year) {
  let posts = 0;
  const themes = {};
  for (const [period, bucket] of Object.entries(company.timeline)) {
    if (!period.startsWith(year)) continue;
    posts += bucket.posts;
    for (const [id, count] of Object.entries(bucket.themes)) themes[id] = (themes[id] || 0) + count;
  }
  return { posts, themes };
}

function focusRnd(index, key) {
  return Math.abs(((index * 73856093) ^ (key * 19349663)) % 1000) / 1000;
}

function focusTickRows(rows, { ariaLabel, limit = 8 }) {
  const selected = rows.slice(0, limit);
  const width = 760;
  const labelWidth = 226;
  const rowHeight = 46;
  const plotStart = labelWidth;
  const plotWidth = width - plotStart - 72;
  const values = selected.map((row) => Math.max(0, Math.round(row.value * 100)));
  const unit = plotWidth / Math.max(...values, 1);
  const height = selected.length * rowHeight + 26;
  const marks = selected
    .map((row, index) => {
      const y = 31 + index * rowHeight;
      const value = values[index];
      const ticks = Array.from({ length: value }, (_, tick) => {
        const x = plotStart + tick * unit + unit / 2;
        const tickHeight = 10 + focusRnd(tick + 1, index + 2) * 7;
        return `<line class="focus-unit-tick${index === 0 ? ' is-hero' : ''} focus-animate" x1="${x.toFixed(1)}" y1="${y + 8}" x2="${x.toFixed(1)}" y2="${(y + 8 - tickHeight).toFixed(1)}" style="--delay:${index * 70 + tick * 10}ms" />`
          + (tick % 5 === 4 ? `<circle class="focus-unit-dot focus-animate" cx="${x.toFixed(1)}" cy="${y + 14}" r="1.2" style="--delay:${index * 70 + tick * 10}ms" />` : '');
      }).join('');
      return `<text class="focus-chart-label focus-animate" x="${labelWidth - 14}" y="${y + 4}" text-anchor="end" style="--delay:${index * 70}ms">${escapeHtml(row.label)}</text>`
        + `<line class="focus-hairline focus-animate" x1="${plotStart}" y1="${y + 8}" x2="${plotStart + plotWidth}" y2="${y + 8}" style="--delay:${index * 70}ms" />`
        + ticks
        + `<text class="focus-chart-value focus-animate" x="${Math.min(plotStart + value * unit + 10, width - 54).toFixed(1)}" y="${y + 4}" style="--delay:${350 + index * 70}ms">${value}%<title>${escapeHtml(row.meta)}</title></text>`;
    })
    .join('');
  return `<svg class="focus-viz-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">${marks}`
    + `<text class="focus-chart-caption focus-animate" x="${width / 2}" y="${height - 4}" text-anchor="middle" style="--delay:850ms">ONE TICK = ONE ROUNDED PERCENTAGE POINT · DOT MARKS EVERY FIFTH</text></svg>`;
}

function focusBallotTally(rows, { ariaLabel, limit = 6 }) {
  const selected = rows.slice(0, limit);
  const width = 760;
  const x0 = 236;
  const x1 = 704;
  const unit = (x1 - x0) / 99;
  const rowHeight = 62;
  const height = selected.length * rowHeight + 28;
  const marks = selected
    .map((row, index) => {
      const value = Math.max(0, Math.min(100, Math.round(row.value * 100)));
      const base = 46 + index * rowHeight;
      const ticks = Array.from({ length: 100 }, (_, tick) => {
        const x = x0 + tick * unit;
        const picked = tick < value;
        const tickHeight = picked
          ? 12 + focusRnd(tick + 1, index + 3) * 6
          : 4.5 + focusRnd(tick + 1, index + 7) * 2.5;
        return `<line class="${picked ? 'focus-ballot-picked' : 'focus-ballot-open'}${picked && index === 0 ? ' is-hero' : ''} focus-animate" x1="${x.toFixed(1)}" y1="${base}" x2="${x.toFixed(1)}" y2="${(base - tickHeight).toFixed(1)}" style="--delay:${index * 75 + tick * 4}ms" />`
          + (tick % 10 === 0 ? `<circle class="focus-unit-dot focus-animate" cx="${x.toFixed(1)}" cy="${base + 6}" r="1.2" style="--delay:${index * 75 + tick * 4}ms" />` : '');
      }).join('');
      const valueX = x0 + Math.max(0, value - 1) * unit + 12;
      return `<text class="focus-chart-label focus-animate" x="${x0 - 16}" y="${base - 8}" text-anchor="end" style="--delay:${index * 75}ms">${escapeHtml(row.label)}</text>`
        + `<line class="focus-hairline focus-animate" x1="${x0}" y1="${base}" x2="${x1}" y2="${base}" style="--delay:${index * 75}ms" />`
        + ticks
        + `<text class="focus-chart-value focus-chart-value--halo focus-animate" x="${Math.min(valueX, x1 + 14).toFixed(1)}" y="${base - 13}" style="--delay:${420 + index * 75}ms">${value}%<title>${escapeHtml(row.meta)}</title></text>`;
    })
    .join('');
  return `<svg class="focus-viz-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">${marks}`
    + `<text class="focus-chart-caption focus-animate" x="${width / 2}" y="${height - 3}" text-anchor="middle" style="--delay:950ms">ONE TICK = ONE ROUNDED PERCENTAGE POINT · EACH TOPIC IS INDEPENDENT</text></svg>`;
}

function focusRungBars(points, ariaLabel) {
  const width = 760;
  const height = 320;
  const baseline = 270;
  const x0 = 62;
  const slot = (width - 110) / Math.max(points.length, 1);
  const step = Math.min(6.5, 184 / Math.max(...points.map((point) => point.value), 1));
  const heroIndex = points.findIndex((point) => point.value === Math.max(...points.map((entry) => entry.value)));
  const marks = points
    .map((point, index) => {
      const x = x0 + index * slot + slot / 2;
      const halfWidth = Math.min(25, slot * 0.28);
      const rungs = Array.from({ length: point.value }, (_, rung) => {
        const y = baseline - rung * step;
        const wobble = (focusRnd(rung + 1, index + 2) - 0.5) * 5;
        return `<line class="focus-rung${index === heroIndex ? ' is-hero' : ''} focus-animate" x1="${(x - halfWidth + wobble).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + halfWidth - wobble).toFixed(1)}" y2="${y.toFixed(1)}" style="--delay:${index * 90 + rung * 12}ms" />`
          + (rung % 5 === 4 ? `<circle class="focus-unit-dot focus-animate" cx="${(x + halfWidth + 7).toFixed(1)}" cy="${y.toFixed(1)}" r="1.2" style="--delay:${index * 90 + rung * 12}ms" />` : '');
      }).join('');
      const top = baseline - Math.max(0, point.value - 1) * step;
      return `${rungs}<text class="focus-chart-value focus-chart-value--halo focus-animate" x="${x.toFixed(1)}" y="${(top - 13).toFixed(1)}" text-anchor="middle" style="--delay:${420 + index * 90}ms">${point.value}<title>${escapeHtml(point.label)}: ${point.value} publishing companies</title></text>`
        + `<text class="focus-chart-label focus-animate" x="${x.toFixed(1)}" y="${baseline + 24}" text-anchor="middle" style="--delay:${index * 90}ms">${escapeHtml(point.short)}</text>`;
    })
    .join('');
  return `<svg class="focus-viz-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">`
    + `<line class="focus-hairline focus-animate" x1="34" y1="${baseline + 5}" x2="726" y2="${baseline + 5}" />${marks}`
    + `<text class="focus-chart-caption focus-animate" x="${width / 2}" y="${height - 3}" text-anchor="middle" style="--delay:950ms">ONE RUNG = ONE PUBLISHING COMPANY · DOT MARKS EVERY FIFTH</text></svg>`;
}

function focusSpark(points) {
  const width = 214;
  const height = 62;
  const pad = 6;
  const step = (width - pad * 2) / Math.max(1, points.length - 1);
  const coords = points.map((point, index) => [pad + index * step, height - 12 - point.value * (height - 22)]);
  const line = coords.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const peak = Math.max(...points.map((point) => point.value));
  const heroIndex = points.findIndex((point) => point.value === peak);
  const hits = points
    .map((point, index) => `<line class="focus-spark-tick focus-animate" x1="${coords[index][0].toFixed(1)}" y1="${height - 12}" x2="${coords[index][0].toFixed(1)}" y2="${height - 18}" style="--delay:${index * 30}ms" />`
      + `<circle class="focus-spark-dot${index === heroIndex ? ' is-hero' : ''} focus-animate" cx="${coords[index][0].toFixed(1)}" cy="${coords[index][1].toFixed(1)}" r="${index === heroIndex ? 3.6 : 2.6}" style="--delay:${160 + index * 45}ms"><title>${escapeHtml(point.label)}: ${focusPercent(point.value)} of the companies publishing then</title></circle>`)
    .join('');
  return `<svg class="focus-viz-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Share of publishing companies by half-year">`
    + `<line class="focus-spark-base focus-animate" x1="${pad}" y1="${height - 12}" x2="${width - pad}" y2="${height - 12}" />`
    + `<path class="focus-spark-line focus-line-draw" pathLength="1" d="${line}" />${hits}</svg>`;
}

function focusDiverging(rows) {
  const encodedRows = encodeURIComponent(JSON.stringify(rows.map((row) => ({
    label: row.label,
    value: Math.round(row.delta * 100)
  }))));
  return `<div class="focus-echart" role="img" aria-label="Change in theme share between 2025 and 2026" data-focus-diverging="${encodedRows}"></div>`;
}

function ensureEcharts() {
  if (globalThis.echarts) return Promise.resolve(globalThis.echarts);
  if (echartsPromise) return echartsPromise;
  echartsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ECHARTS_URL;
    script.async = true;
    script.onload = () => {
      if (globalThis.echarts) resolve(globalThis.echarts);
      else reject(new Error('Chart library loaded without a browser API'));
    };
    script.onerror = () => reject(new Error('Could not load chart library'));
    document.head.append(script);
  }).catch((error) => {
    echartsPromise = null;
    throw error;
  });
  return echartsPromise;
}

function initialiseFocusVisuals() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = (element, draw) => {
    const go = () => {
      element.classList.remove('is-visible');
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          element.classList.add('is-visible');
          draw?.();
        });
      });
    };
    if (reducedMotion || !('IntersectionObserver' in window)) go();
    else {
      const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        go();
        observer.disconnect();
      }, { threshold: 0.3 });
      observer.observe(element);
    }
    element.addEventListener('click', go);
  };

  elements.focusReportInner.querySelectorAll('.focus-viz-svg').forEach((svg) => reveal(svg));
  elements.focusReportInner.querySelectorAll('[data-focus-diverging]').forEach((container) => {
    const rows = JSON.parse(decodeURIComponent(container.dataset.focusDiverging));
    const draw = () => {
      if (!globalThis.echarts) {
        void ensureEcharts().then(draw).catch((error) => {
          console.error(error);
          container.setAttribute('aria-label', `${container.getAttribute('aria-label')}; chart unavailable`);
        });
        return;
      }
      const chart = globalThis.echarts.getInstanceByDom(container) || globalThis.echarts.init(container, null, { renderer: 'svg' });
      chart.clear();
      chart.setOption({
        animationDuration: reducedMotion ? 0 : 900,
        animationEasing: 'quarticOut',
        animationDelay: (index) => index * 80,
        tooltip: {
          backgroundColor: '#1F1E1C',
          borderWidth: 0,
          padding: [10, 14],
          textStyle: { color: '#F0F0EE', fontFamily: 'Familjen Grotesk', fontSize: 12 },
          formatter: (point) => `${point.name} — ${point.value > 0 ? '+' : ''}${point.value} points`
        },
        grid: { left: 190, right: 58, top: 8, bottom: 8 },
        xAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: 'rgba(31,30,28,.16)' } },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false }
        },
        yAxis: {
          type: 'category',
          data: rows.map((row) => row.label),
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: 'rgba(31,30,28,.72)', fontFamily: 'Familjen Grotesk', fontSize: 10, fontWeight: 600 }
        },
        series: [{
          type: 'bar',
          barWidth: 16,
          data: rows.map((row) => ({
            name: row.label,
            value: row.value,
            itemStyle: {
              color: row.value === Math.max(...rows.map((entry) => entry.value))
                ? '#F1532B'
                : row.value >= 0 ? '#22211F' : '#8F8E86',
              borderRadius: row.value >= 0 ? [0, 9, 9, 0] : [9, 0, 0, 9]
            }
          })),
          label: {
            show: true,
            fontFamily: 'Familjen Grotesk',
            fontSize: 11,
            fontWeight: 700,
            position: 'outside',
            formatter: (point) => `${point.value > 0 ? '+' : ''}${point.value}`,
            color: '#1F1E1C'
          },
          markLine: {
            symbol: 'none',
            silent: true,
            label: { show: false },
            lineStyle: { color: 'rgba(31,30,28,.60)', width: 1.5 },
            data: [{ xAxis: 0 }]
          }
        }]
      });
      if ('ResizeObserver' in window && !container.focusResizeObserver) {
        container.focusResizeObserver = new ResizeObserver(() => chart.resize());
        container.focusResizeObserver.observe(container);
      }
    };
    reveal(container, draw);
  });
}

function focusCompanyCard(company) {
  const bars = company.topThemes
    .map((theme) => `<div class="focus-mini"><span class="focus-mini-label">${escapeHtml(theme.label)}</span>`
      + `<span class="focus-mini-track"><span class="focus-mini-fill" style="width:${Math.max(3, theme.share * 100).toFixed(1)}%"></span></span>`
      + `<span class="focus-mini-value">${focusPercent(theme.share)}</span></div>`)
    .join('');
  const terms = company.distinctiveTerms.slice(0, 8).map((term) => escapeHtml(term.term)).join(' · ');
  const span = company.activity.firstPost
    ? `${company.activity.firstPost.slice(0, 7)} → ${company.activity.lastPost.slice(0, 7)}`
    : 'no dated posts';
  const proxyNote = company.coverage.postsTextProxy
    ? ` · ${company.coverage.postsTextProxy} via text proxy`
    : '';
  return `<article class="focus-company">
      <div>
        <h4>${escapeHtml(company.name)}</h4>
        <p class="focus-company-meta">${escapeHtml(company.industry || '—')} · ${company.coverage.postsAnalyzed} posts read${proxyNote} · ${escapeHtml(span)}</p>
      </div>
      <div class="focus-block">
        <p class="focus-block-label focus-block-label--posts">Blog themes</p>
        ${bars || '<p class="focus-empty">No posts in the corpus.</p>'}
      </div>
      <div class="focus-block">
        <p class="focus-block-label">Distinctive blog vocabulary</p>
        <p class="focus-terms">${terms || '<span class="focus-empty">Site blocked the reader.</span>'}</p>
      </div>
    </article>`;
}

function separatedFocusReportTemplate(data) {
  const homepageAnalysis = data.homepageAnalysis;
  const homepageCompanies = data.companies.filter(
    (company) => company.coverage.homepage === 'full' || company.coverage.homepage === 'partial'
  );
  const homepagesRead = homepageAnalysis.companies;
  const profiled = data.companies.filter((company) => company.coverage.postsAnalyzed >= FOCUS_MIN_POSTS);
  const homepageTheme = (id) => homepageAnalysis.themes.find((theme) => theme.id === id);
  const homepageThemes = homepageAnalysis.themes
    .map((theme) => ({
      ...theme,
      value: theme.focusShare,
      meta: `${focusPercent(theme.focusShare)} focus · ${theme.companies}/${homepagesRead} sites`
    }))
    .sort((a, b) => b.value - a.value);
  const blogTopics = data.themes
    .map((theme) => {
      const value = profiled.reduce((sum, company) => sum + company.themes[theme.id].postShare, 0) / profiled.length;
      return { id: theme.id, label: theme.label, value, meta: `${focusPercent(value)} average post share` };
    })
    .sort((a, b) => b.value - a.value);

  const termScores = homepageAnalysis.prominentTerms.slice(0, 12);
  const maxTermScore = Math.max(...termScores.map((term) => term.score), 1);
  const minTermScore = Math.min(...termScores.map((term) => term.score), maxTermScore);
  const homepageTermCloud = termScores.map((term) => {
    const scale = (term.score - minTermScore) / Math.max(maxTermScore - minTermScore, 1);
    const size = (0.72 + scale * 0.58).toFixed(2);
    return `<li title="Prominence score ${term.score} across ${term.companies} homepages">`
      + `<span style="font-size:${size}rem">${escapeHtml(term.term)}</span>`
      + `<small>${term.companies} sites</small></li>`;
  }).join('');

  const laneDefinitions = [
    {
      label: 'Agent control stack',
      description: 'Agents or automation paired with reasoning, trust, or governance.',
      matches: (company) => company.homepageThemes.includes('agents')
        && ['reasoning', 'trust', 'governance'].some((theme) => company.homepageThemes.includes(theme))
    },
    {
      label: 'Regulated decisioning',
      description: 'Healthcare or finance paired with trust or governance.',
      matches: (company) => ['healthcare', 'finance'].some((theme) => company.homepageThemes.includes(theme))
        && ['trust', 'governance'].some((theme) => company.homepageThemes.includes(theme))
    },
    {
      label: 'Knowledge layer',
      description: 'Knowledge graphs, ontologies, or semantic models as product infrastructure.',
      matches: (company) => company.homepageThemes.includes('knowledge')
    },
    {
      label: 'Formal verification',
      description: 'Formal methods, proof, or verification as an explicit homepage claim.',
      matches: (company) => company.homepageThemes.includes('verification')
    }
  ];
  const lanes = laneDefinitions.map((lane) => ({
    ...lane,
    companies: homepageCompanies.filter(lane.matches)
  }));
  const laneCards = lanes.map((lane) => `
    <article class="focus-lane">
      <p class="focus-lane-count">${lane.companies.length}<span> / ${homepagesRead}</span></p>
      <h4>${escapeHtml(lane.label)}</h4>
      <p>${escapeHtml(lane.description)}</p>
      <p class="focus-lane-examples">Examples: ${escapeHtml(lane.companies.slice(0, 4).map((company) => company.name).join(', '))}${lane.companies.length > 4 ? ', …' : ''}</p>
    </article>`).join('');

  const periods = Object.keys(data.companyTrend).filter((period) => period >= FOCUS_TREND_START).sort();
  const currentPeriod = focusPeriodOf(data.generatedAt);
  const completePeriods = periods.filter((period) => period !== currentPeriod);
  const activity = periods.map((period) => ({
    label: period,
    short: period.replace('20', '').replace('-H', 'H'),
    companies: data.companyTrend[period].companies,
    posts: data.trend[period].posts
  }));
  const completeActivity = activity.filter((point) => point.label !== currentPeriod);
  const lastFull = completeActivity.at(-1);
  const currentPartial = activity.find((point) => point.label === currentPeriod);
  const latestTrend = data.companyTrend[lastFull.label];
  const latestCount = (theme) => latestTrend.themes[theme] || 0;
  const latestPublishingCompanies = data.companies.filter(
    (company) => company.coverage.postsAnalyzed > 0 && company.timeline[lastFull.label]
  );
  const publishedOn = (company, theme) => Boolean(company.timeline[lastFull.label]?.themes[theme]);
  const agentTrust = latestPublishingCompanies.filter(
    (company) => publishedOn(company, 'agents') && publishedOn(company, 'trust')
  ).length;
  const agentGovernance = latestPublishingCompanies.filter(
    (company) => publishedOn(company, 'agents') && publishedOn(company, 'governance')
  ).length;
  const sparks = data.themes
    .map((theme) => ({
      label: theme.label,
      points: completePeriods.map((period) => ({ label: period, value: data.companyTrend[period].themeShare[theme.id] || 0 })),
      latest: latestTrend.themeShare[theme.id] || 0
    }))
    .sort((a, b) => b.latest - a.latest);

  const panel = data.companies.filter(
    (company) => focusYearTotals(company, '2025').posts >= FOCUS_PANEL_MIN_POSTS
      && focusYearTotals(company, '2026').posts >= FOCUS_PANEL_MIN_POSTS
  );
  const panelMean = (theme, year) => panel.reduce((sum, company) => {
    const totals = focusYearTotals(company, year);
    return sum + (totals.themes[theme] || 0) / totals.posts;
  }, 0) / panel.length;
  const panelRows = data.themes
    .map((theme) => {
      const before = panelMean(theme.id, '2025');
      const after = panelMean(theme.id, '2026');
      return { id: theme.id, label: theme.label, before, after, delta: after - before };
    })
    .sort((a, b) => b.delta - a.delta);
  const companyThemeShare = (company, theme, year) => {
    const totals = focusYearTotals(company, year);
    return totals.posts ? (totals.themes[theme] || 0) / totals.posts : 0;
  };
  const neurosymbolicPanel = panelRows.find((row) => row.id === 'neurosymbolic');
  const governancePanel = panelRows.find((row) => row.id === 'governance');
  const nesyShifts = panel.map((company) => {
    const before = companyThemeShare(company, 'neurosymbolic', '2025');
    const after = companyThemeShare(company, 'neurosymbolic', '2026');
    return { company, before, after, delta: after - before };
  });
  const nesyDown = nesyShifts.filter((entry) => entry.delta < 0);
  const governanceUp = panel.filter(
    (company) => companyThemeShare(company, 'governance', '2026') > companyThemeShare(company, 'governance', '2025')
  );
  const steepest = nesyDown
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3)
    .map((entry) => `${entry.company.name} (${focusPercent(entry.before)} → ${focusPercent(entry.after)})`)
    .join(', ');

  const o9 = data.companies.find((company) => company.name === 'o9 Solutions');
  const o9Share = (period) => (o9?.timeline[period]?.posts || 0) / Math.max(data.trend[period].posts, 1);
  const snapshotDate = formatPostDate(data.generatedAt.slice(0, 10));
  const homeNesy = homepageTheme('neurosymbolic');
  const homeAgents = homepageTheme('agents');
  const homeReasoning = homepageTheme('reasoning');
  const homeLlm = homepageTheme('llm');
  const homeTrust = homepageTheme('trust');
  const homeGovernance = homepageTheme('governance');

  return `
    <div class="focus-section">
      <p class="focus-eyebrow">Market signal · ${escapeHtml(snapshotDate)}</p>
      <h3 id="focus-report-title" class="focus-report-title">Two separate lenses on the NeSy field</h3>
      <p class="focus-note focus-lede">
        Homepage positioning answers what the field wants to be known for now. Blog publishing is a separate evidence
        layer: it shows the problems, use cases, and technical details companies choose to unpack. The two sources are
        analyzed independently below rather than blended into one score.
      </p>
      <div class="focus-stats">
        <div class="focus-stat"><span class="focus-stat-value">${data.coverage.companies}</span><span class="focus-stat-label">companies in directory</span></div>
        <div class="focus-stat"><span class="focus-stat-value">${homepagesRead}</span><span class="focus-stat-label">homepages analyzed</span></div>
        <div class="focus-stat"><span class="focus-stat-value">${data.coverage.postsAnalyzed.toLocaleString('en-GB')}</span><span class="focus-stat-label">blogs analyzed separately</span></div>
        <div class="focus-stat"><span class="focus-stat-value">${lastFull.label}</span><span class="focus-stat-label">latest complete blog window</span></div>
      </div>
      <p class="focus-ai-disclaimer" role="note">
        <strong>AI disclosure</strong> · Largely generated by <code>gpt-5.6-sol</code>, with light modifications by humans.
      </p>
    </div>

    <div class="focus-section focus-part-header">
      <p class="focus-eyebrow">Part I — Homepage-only analysis</p>
      <h3>The field wants to own trusted, reasoning-first agents</h3>
      <p class="focus-note">
        Explicit neurosymbolic framing appears on ${homeNesy.companies} of ${homepagesRead} readable homepages and
        carries ${focusPercent(homeNesy.focusShare)} of the prominence-weighted theme focus. Agents rank second
        (${homeAgents.companies} sites; ${focusPercent(homeAgents.focusShare)} of focus), followed by reasoning
        (${homeReasoning.companies}; ${focusPercent(homeReasoning.focusShare)}). This is the homepage-only read: these
        companies want to be known for combining model flexibility with structured, controllable decisions.
      </p>
      <div class="focus-insights" aria-label="Homepage positioning signals">
        <article class="focus-insight focus-insight--homepage">
          <p class="focus-insight-value">${homeNesy.companies} / ${homepagesRead}</p>
          <h4>NeSy is the category identity</h4>
          <p>${focusPercent(homeNesy.focusShare)} of weighted homepage theme focus, the strongest field signal.</p>
        </article>
        <article class="focus-insight focus-insight--homepage">
          <p class="focus-insight-value">${homeAgents.companies} / ${homepagesRead}</p>
          <h4>Agents are the product direction</h4>
          <p>${focusPercent(homeAgents.focusShare)} of weighted focus, often paired with reasoning or controls.</p>
        </article>
        <article class="focus-insight focus-insight--homepage">
          <p class="focus-insight-value">${focusPercent(homeReasoning.focusShare)} vs ${focusPercent(homeLlm.focusShare)}</p>
          <h4>Reasoning gets the bigger headline</h4>
          <p>Reasoning and LLMs each appear on ${homeReasoning.companies} sites, but reasoning receives twice the weighted prominence.</p>
        </article>
        <article class="focus-insight focus-insight--homepage">
          <p class="focus-insight-value">${homeTrust.companies} + ${homeGovernance.companies}</p>
          <h4>Control is part of the core pitch</h4>
          <p>Sites mentioning trust and governance respectively; these overlap and are not added as unique companies.</p>
        </article>
      </div>
      <article class="focus-panel focus-chart-card">
        <h4 class="focus-panel-title">Neurosymbolic framing is the clearest homepage signal</h4>
        <p class="focus-chart-sub">Top 8 of ${homepageThemes.length} themes · one tick = one rounded point · orange = leading theme</p>
        ${focusTickRows(homepageThemes, {
          ariaLabel: 'Top homepage themes ranked by prominence-weighted focus share'
        })}
        <p class="focus-note focus-note--small">
          Focus share is normalized within each company, then averaged so a long homepage cannot dominate the field.
          Theme prevalence is shown at the right of each bar.
        </p>
        <p class="focus-chart-source">TICK ROWS · F5 · WIRE · HOMEPAGE PROMINENCE · COMPANY FOCUS SNAPSHOT</p>
      </article>
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">01 — Prominent homepage language</p>
      <h3>What companies put in titles and large headings</h3>
      <p class="focus-note">
        This vocabulary comes only from page titles and H1–H3 headings—not blogs or body-copy frequency. Larger semantic
        headings receive more weight, making this a closer proxy for what a visitor is meant to notice first.
      </p>
      <ul class="focus-term-cloud" aria-label="Prominent homepage terms">${homepageTermCloud}</ul>
      <p class="focus-note focus-note--small">Page title 4× · H1 5× · H2 3× · H3 2×. Company and product names are removed.</p>
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">02 — Homepage positioning lanes</p>
      <h3>The scene clusters around agent control and regulated decisions</h3>
      <p class="focus-note">
        Four overlapping homepage patterns make the market easier to read. They are signals, not exclusive segments:
        one company can sit in several lanes. The dominant formula is an agent or model layer wrapped in reasoning and
        control; explicit formal verification remains a specialist position.
      </p>
      <div class="focus-lanes">${laneCards}</div>
    </div>

    <div class="focus-section focus-part-header focus-part-header--blogs">
      <p class="focus-eyebrow">Part II — Blog-only analysis</p>
      <h3>Blogs show the detail behind the positioning</h3>
      <p class="focus-note">
        Blog content is not used to define the homepage focus above. Here it becomes the evidence layer: across
        ${profiled.length} companies with at least ${FOCUS_MIN_POSTS} readable posts, the largest average topic shares
        are ${escapeHtml(blogTopics[0].label)} (${focusPercent(blogTopics[0].value)}),
        ${escapeHtml(blogTopics[1].label)} (${focusPercent(blogTopics[1].value)}), and
        ${escapeHtml(blogTopics[2].label)} (${focusPercent(blogTopics[2].value)}).
      </p>
      <div class="focus-insights" aria-label="Blog publishing signals">
        <article class="focus-insight">
          <p class="focus-insight-value">${latestCount('llm')} / ${latestTrend.companies}</p>
          <h4>Models remain the shared context</h4>
          <p>Publishers mentioning LLMs or generative AI in the latest complete half-year.</p>
        </article>
        <article class="focus-insight">
          <p class="focus-insight-value">${agentTrust} / ${latestTrend.companies}</p>
          <h4>Agent detail comes with guardrails</h4>
          <p>Publishers discussing both agents and trust; ${agentGovernance} also covered agents and governance.</p>
        </article>
        <article class="focus-insight">
          <p class="focus-insight-value">${latestCount('reasoning')} vs ${latestCount('verification')}</p>
          <h4>Reasoning is broad; proof stays niche</h4>
          <p>Publishers touching reasoning versus formal verification in ${escapeHtml(lastFull.label)}.</p>
        </article>
        <article class="focus-insight">
          <p class="focus-insight-value">${latestCount('neurosymbolic')} / ${latestTrend.companies}</p>
          <h4>The category label still appears</h4>
          <p>Publishers using explicit NeSy language in the latest complete half-year.</p>
        </article>
      </div>
      <article class="focus-panel focus-chart-card">
        <h4 class="focus-panel-title">${escapeHtml(blogTopics[0].label)} leads the blog evidence layer</h4>
        <p class="focus-chart-sub">Top 6 of ${blogTopics.length} independently matched themes · one tick = one rounded point · orange = leading theme</p>
        ${focusBallotTally(blogTopics, {
          ariaLabel: 'Top blog themes ranked by average within-company post share'
        })}
        <p class="focus-note focus-note--small">Each profiled company receives equal weight; this chart uses blog content only.</p>
        <p class="focus-chart-source">BALLOT TALLY · L15 · WIRE · MULTI-LABEL BLOG THEMES · COMPANY FOCUS SNAPSHOT</p>
      </article>
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">03 — Blog publishing activity</p>
      <h3>The corpus gets much louder after 2024—but that is not market growth</h3>
      <p class="focus-note">
        Companies publishing in a complete half-year rose from ${completeActivity[0].companies} in
        ${escapeHtml(completeActivity[0].label)} to ${lastFull.companies} in ${escapeHtml(lastFull.label)}. This shows
        more members of today's directory producing discoverable content; it does not show that the number of startups,
        customers, or dollars grew at the same rate.
      </p>
      <article class="focus-panel focus-chart-card">
        <h4 class="focus-panel-title">More of today’s directory publishes every half-year</h4>
        <p class="focus-chart-sub">Distinct publishers · complete half-years only · one rung = one company · orange = peak period</p>
        ${focusRungBars(
          completeActivity.map((point) => ({ ...point, value: point.companies })),
          'Distinct companies publishing by half-year'
        )}
        <p class="focus-note focus-note--small">Post volume rose from ${completeActivity[0].posts} to ${lastFull.posts}, but o9 Solutions supplied ${focusPercent(o9Share(completeActivity[0].label))} of ${escapeHtml(completeActivity[0].label)} and ${focusPercent(o9Share(lastFull.label))} of ${escapeHtml(lastFull.label)}; publisher count is the more stable field signal.</p>
        <p class="focus-chart-source">RUNG BARS · F1 · WIRE · PUBLISHING COMPANIES · COMPANY FOCUS SNAPSHOT</p>
      </article>
      ${currentPartial ? `<p class="focus-note focus-note--small">Excluded from these comparisons: ${escapeHtml(currentPartial.label)} is partial through ${escapeHtml(snapshotDate)} (${currentPartial.companies} publishers, ${currentPartial.posts} posts).</p>` : ''}
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">04 — Blog theme trends</p>
      <h3>Reasoning is moving to the center of the agent story</h3>
      <p class="focus-note">
        In ${escapeHtml(lastFull.label)}, ${latestCount('llm')} of ${latestTrend.companies} publishers touched LLMs,
        ${latestCount('reasoning')} touched reasoning, ${latestCount('governance')} governance, and
        ${latestCount('agents')} agents. ${agentTrust} published about both agents and trust. The emerging blog story is
        not “symbols instead of models”; it is “models and agents with structure, controls, and domain accountability.”
      </p>
      <p class="focus-note focus-note--small">
        Each panel counts a company once per half-year per theme, however many posts it published. Cohort membership
        changes over time, so movement reflects both changing language and a changing mix of publishers.
      </p>
      <article class="focus-panel focus-chart-card">
        <h4 class="focus-panel-title">The six most widespread themes move on different paths</h4>
        <p class="focus-chart-sub">Share of publishing companies touching each theme · one dot = one complete half-year · orange = series peak</p>
        <div class="focus-sparks">
          ${sparks.slice(0, 6).map((entry) => `<div class="focus-spark">
            <div class="focus-spark-head"><span class="focus-spark-name">${escapeHtml(entry.label)}</span><span class="focus-spark-now">${focusPercent(entry.latest)}</span></div>
            ${focusSpark(entry.points)}
            <div class="focus-spark-scale"><span>${escapeHtml(completePeriods[0])}</span><span>${escapeHtml(completePeriods.at(-1))}</span></div>
          </div>`).join('')}
        </div>
        <p class="focus-chart-source">HAIRLINE LINE · F2 · WIRE · TOP 6 THEME TRAJECTORIES · COMPANY FOCUS SNAPSHOT</p>
      </article>
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">05 — The same blogs, two years apart</p>
      <h3>Repeat publishers are diverging in how often they use the label</h3>
      <p class="focus-note">
        Across the broad ${escapeHtml(lastFull.label)} blog cohort, ${latestCount('neurosymbolic')} of
        ${latestTrend.companies} publishers used explicit NeSy language. In the fixed panel of ${panel.length} repeat
        publishers, its mean within-company post share moved from ${focusPercent(neurosymbolicPanel.before)} in 2025 to
        ${focusPercent(neurosymbolicPanel.after)} in 2026, while governance moved from
        ${focusPercent(governancePanel.before)} to ${focusPercent(governancePanel.after)}.
      </p>
      <p class="focus-note">
        This is divergence within blogs, not a homepage rebrand: ${nesyDown.length} of ${panel.length} companies used the
        label less, while ${panel.length - nesyDown.length} were flat or higher. The sharpest declines were
        ${escapeHtml(steepest)}. Governance rose at ${governanceUp.length} of ${panel.length} companies.
      </p>
      <article class="focus-panel focus-chart-card">
        <h4 class="focus-panel-title">Governance gains while explicit NeSy language fragments</h4>
        <p class="focus-chart-sub">Equal-weighted repeat-publisher panel · 2025 → 2026 YTD · decline left, growth right · orange = largest gain</p>
        ${focusDiverging(panelRows)}
        <p class="focus-note focus-note--small">
          Panel: ${escapeHtml(panel.map((company) => company.name).join(', '))}. Each published at least
          ${FOCUS_PANEL_MIN_POSTS} dated posts in both years. 2026 is year-to-date through ${escapeHtml(snapshotDate)};
          bars show percentage-point change in the equal-weighted company mean.
        </p>
        <p class="focus-chart-source">DIVERGING BAR · G10 · WIRE · YEAR-OVER-YEAR TOPIC SHIFT · COMPANY FOCUS SNAPSHOT</p>
      </article>
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">06 — Blogs by company</p>
      <h3>What each company chooses to explain in detail</h3>
      <p class="focus-note">
        These are blog-content fingerprints, not rankings. Homepage language is intentionally absent from these cards.
        A strong signal does not measure product depth, traction, or technical merit.
      </p>
      <div class="focus-companies">
        ${data.companies.map((company) => focusCompanyCard(company)).join('')}
      </div>
    </div>

    <div class="focus-section">
      <p class="focus-eyebrow">07 — Method and limits</p>
      <h3>How the two lenses are kept separate</h3>
      <ul class="focus-method">
        <li><strong>Separation.</strong> Homepage focus and blog focus are calculated independently. No combined score
          is used anywhere in this report.</li>
        <li><strong>Homepage prominence.</strong> Body theme evidence receives 1× weight, H3 2×, H2 3×, the page title
          4×, and H1 5×. Semantic heading levels are a reproducible proxy for font prominence; external CSS font sizes
          are not executed. Company-normalized scores prevent long pages from winning by volume.</li>
        <li><strong>Homepage coverage.</strong> ${data.coverage.homepagesFetched} full homepages and
          ${data.coverage.homepagesMetaOnly} usable metadata descriptions are analyzed. ${data.coverage.homepagesTitleOnly}
          title-only pages are excluded from the denominator. ${data.coverage.homepagesTextProxy} blocked homepage is
          read through a labeled text proxy.</li>
        <li><strong>Blog corpus.</strong> ${data.coverage.postsFullText.toLocaleString('en-GB')} posts were read in full,
          ${data.coverage.postsExcerptOnly} through stored o9 excerpts, ${data.coverage.postsMetaOnly} through a metadata
          description, and ${data.coverage.postsTitleOnly} by title alone. ${data.coverage.postsTextProxy} of the full-text
          posts are QGI pages recovered through the labeled text proxy.</li>
        <li><strong>Themes.</strong> ${data.themes.length} narrow keyword families are matched case-insensitively. This is
          lexical, not semantic: a page arguing against knowledge graphs still counts as touching that theme.</li>
        <li><strong>Vocabulary.</strong> Homepage terms come only from titles and H1–H3 text with the weights above.
          Company blog vocabulary is scored separately by TF-IDF across posts. Company, product, and founder names are
          removed from both.</li>
        <li><strong>Blog dates.</strong> Only dated posts enter trend charts. The current half-year is excluded until
          complete; the fixed-cohort 2026 comparison is explicitly year-to-date.</li>
        <li><strong>Interpretation.</strong> Both lenses describe public language—not market size, revenue, adoption,
          customer evidence, or whether a technical claim works.</li>
      </ul>
      <p class="focus-note focus-note--small">
        Generated by <code>scripts/company-focus.mjs</code> · snapshot ${escapeHtml(data.generatedAt.slice(0, 10))}
      </p>
    </div>`;
}

function renderFocusReport() {
  if (!companyFocus || elements.focusReportInner.dataset.rendered === 'true') return;
  elements.focusReportInner.innerHTML = separatedFocusReportTemplate(companyFocus);
  elements.focusReportInner.dataset.rendered = 'true';
  initialiseFocusVisuals();
}

function setFocusReportOpen(open, { scroll = false } = {}) {
  if (open) renderFocusReport();
  elements.focusReport.hidden = !open;
  elements.blogsView.classList.toggle('is-focus-report', open);
  elements.focusReportToggle.setAttribute('aria-expanded', String(open));
  if (open && scroll) {
    window.requestAnimationFrame(() => {
      elements.focusReport.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function openFocusReport(event) {
  event.preventDefault();
  const targetHash = event.currentTarget.getAttribute('href');
  if (window.location.hash !== targetHash) {
    window.history.pushState(null, '', targetHash);
  }
  showView('blogs');
  setFocusReportOpen(true, { scroll: true });
}

function paperSearchableText(paper) {
  if (paperSearchableText.cache.has(paper)) return paperSearchableText.cache.get(paper);
  const value = [
    paper.id,
    paper.title,
    paper.abstract,
    paper.conference,
    paper.venue,
    paper.year,
    paper.doi,
    ...(paper.authors || []),
    ...(paper.affiliations || []),
    ...(paper.categories || []),
    ...(paper.matches?.title || []),
    ...(paper.matches?.abstract || [])
  ].join(' ').toLowerCase();
  paperSearchableText.cache.set(paper, value);
  return value;
}

paperSearchableText.cache = new WeakMap();

function paperConferenceValue(paper) {
  return paper.conference || (paper.venue && paper.venue !== 'arXiv' ? paper.venue : 'arXiv');
}

function paperConferenceClass(conference) {
  const knownClasses = {
    AAAI: 'aaai',
    ICLR: 'iclr',
    ICML: 'icml',
    IJCAI: 'ijcai',
    NeurIPS: 'neurips',
    NeSy: 'nesy',
    arXiv: 'arxiv'
  };
  return knownClasses[conference] || 'other';
}

function paperFacetValues(paper, facet) {
  let cached = paperFacetValues.cache.get(paper);
  if (!cached) {
    cached = {
      year: [String(paper.year || paper.published?.slice(0, 4) || '')].filter(Boolean),
      conference: [paperConferenceValue(paper)],
      author: [...new Set(paper.authors || [])],
      institution: [...new Set(paper.affiliations || [])]
    };
    paperFacetValues.cache.set(paper, cached);
  }
  return cached[facet] || [];
}

paperFacetValues.cache = new WeakMap();

function paperMatchesCurrentFilters(paper, excludedFacet = '') {
  const query = state.paperQuery.trim().toLowerCase();
  if (query && !paperSearchableText(paper).includes(query)) return false;
  if (
    excludedFacet !== 'year'
    && state.paperYears.size > 0
    && !paperFacetValues(paper, 'year').some((value) => state.paperYears.has(value))
  ) return false;
  if (
    excludedFacet !== 'conference'
    && state.paperConferences.size > 0
    && !paperFacetValues(paper, 'conference').some((value) => state.paperConferences.has(value))
  ) return false;
  if (
    excludedFacet !== 'author'
    && state.paperAuthors.size > 0
    && !paperFacetValues(paper, 'author').some((value) => state.paperAuthors.has(value))
  ) return false;
  if (
    excludedFacet !== 'institution'
    && state.paperInstitutions.size > 0
    && !paperFacetValues(paper, 'institution').some((value) => state.paperInstitutions.has(value))
  ) return false;
  return true;
}

function matchingPapers() {
  const matches = arxivPapers.filter((paper) => paperMatchesCurrentFilters(paper));

  return matches.sort((a, b) => {
    if (state.paperSort === 'title') {
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    }
    const comparison = a.published.localeCompare(b.published);
    return state.paperSort === 'oldest' ? comparison : -comparison;
  });
}

function paperMatchBadges(paper) {
  const badges = [];
  (paper.matches?.title || []).forEach((keyword) => badges.push(`Title · ${keyword}`));
  (paper.matches?.abstract || []).forEach((keyword) => badges.push(`Abstract · ${keyword}`));
  return [...new Set(badges)].map((badge) => (
    `<span class="paper-match">${escapeHtml(badge)}</span>`
  )).join('');
}

function paperItemTemplate(paper) {
  const authorLabel = (paper.authors || []).join(', ');
  const paperAffiliations = paper.affiliations || [];
  const affiliationLabel = paperAffiliations.length > 3
    ? `${paperAffiliations.slice(0, 3).join(' · ')} · +${paperAffiliations.length - 3} more`
    : paperAffiliations.join(' · ');
  const categories = (paper.categories || []).map((category) => (
    `<span class="paper-category">${escapeHtml(category)}</span>`
  )).join('');
  const conference = paperConferenceValue(paper);
  const conferenceLabel = conference;
  const conferenceClass = paperConferenceClass(conference);
  const conferenceTitle = conference === 'arXiv' ? 'Source: arXiv' : `Published venue: ${conference}`;
  const paperId = paper.arxivId ? `arXiv:${paper.arxivId}` : conferenceLabel;
  const sourceUrl = paper.url || paper.doiUrl || '';
  const abstractAction = sourceUrl
    ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Source${externalIcon}</a>`
    : '';
  const pdfAction = paper.pdfUrl
    ? `<a href="${escapeHtml(paper.pdfUrl)}" target="_blank" rel="noopener noreferrer">PDF${externalIcon}</a>`
    : '';
  const doiAction = !paper.pdfUrl && paper.doiUrl
    ? `<a href="${escapeHtml(paper.doiUrl)}" target="_blank" rel="noopener noreferrer">DOI${externalIcon}</a>`
    : '';

  return `
    <li class="paper-card">
      <article>
        <div class="paper-card-topline">
          <div class="paper-categories">${categories}</div>
          <span class="paper-id">${escapeHtml(paperId)}</span>
        </div>
        <h3>${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(paper.title)}</a>` : escapeHtml(paper.title)}</h3>
        <p class="paper-authors">${escapeHtml(authorLabel)}</p>
        ${affiliationLabel ? `<p class="paper-affiliations">${escapeHtml(affiliationLabel)}</p>` : ''}
        <p class="paper-abstract">${escapeHtml(paper.abstract)}</p>
        <div class="paper-card-footer">
          <div class="paper-matches" aria-label="Matched inclusion keywords">${paperMatchBadges(paper)}</div>
          <div class="paper-actions">
            <span class="paper-date">${calendarIcon}${escapeHtml(formatPostDate(paper.published))}</span>
            <span class="paper-conference paper-conference--${conferenceClass}" title="${escapeHtml(conferenceTitle)}">${conferenceIcon}<span>${escapeHtml(conferenceLabel)}</span></span>
            ${abstractAction}${pdfAction}${doiAction}
          </div>
        </div>
      </article>
    </li>`;
}

function setPaperLoadStatus(status, message = '') {
  const loading = status === 'loading';
  const error = status === 'error';
  elements.papersView.setAttribute('aria-busy', String(loading));
  elements.paperFilterPanel.classList.toggle('is-loading', loading);
  elements.paperLoadStatus.classList.toggle('is-error', error);
  elements.paperLoadStatus.hidden = status === 'loaded' || status === 'idle';
  if (loading) {
    elements.paperLoadStatus.innerHTML = '<span class="paper-load-spinner" aria-hidden="true"></span><span>Loading the research index…</span>';
  } else if (error) {
    elements.paperLoadStatus.innerHTML = `<span>${escapeHtml(message || 'The research index could not be loaded.')}</span><button type="button" data-retry-paper-load>Try again</button>`;
  } else {
    elements.paperLoadStatus.replaceChildren();
  }
}

function resetPaperFacetDom() {
  [
    elements.paperYearFilters,
    elements.paperConferenceFilters,
    elements.paperAuthorFilters,
    elements.paperInstitutionFilters
  ].forEach((element) => {
    element.replaceChildren();
    delete element.paperFacetItems;
    delete element.paperFacetValues;
    delete element.paperFacetCounts;
  });
}

function ensurePaperData() {
  if (paperDataStatus === 'loaded') return Promise.resolve(true);
  if (paperDataPromise) return paperDataPromise;

  paperDataStatus = 'loading';
  setPaperLoadStatus('loading');
  elements.papersUpdated.textContent = 'Loading snapshot…';
  elements.papersResultsCount.textContent = 'Loading papers…';
  elements.papersList.replaceChildren();
  elements.papersEmpty.hidden = true;
  elements.papersLoadMore.hidden = true;

  paperDataPromise = fetch(PAPER_DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((corpus) => {
      if (!corpus || !Array.isArray(corpus.papers)) throw new Error('Invalid paper dataset');
      arxivPapers = corpus.papers;
      arxivPapersMeta = {
        keywords: corpus.keywords || [],
        generatedAt: corpus.generatedAt || '',
        yearRange: corpus.yearRange || null
      };
      paperSearchableText.cache = new WeakMap();
      paperFacetValues.cache = new WeakMap();
      rebuildPaperFacetIndex();
      resetPaperFacetDom();
      paperDataStatus = 'loaded';
      setPaperLoadStatus('loaded');
      renderPaperMetadata();
      if (state.activeView === 'papers') renderPapers();
      return true;
    })
    .catch((error) => {
      console.error(`Could not load ${PAPER_DATA_URL}:`, error);
      paperDataStatus = 'error';
      setPaperLoadStatus('error');
      elements.papersUpdated.textContent = 'Snapshot unavailable';
      elements.papersResultsCount.textContent = 'Research index unavailable';
      return false;
    })
    .finally(() => {
      paperDataPromise = null;
    });

  return paperDataPromise;
}

function renderPapers() {
  if (paperDataStatus !== 'loaded') {
    elements.papersList.replaceChildren();
    elements.papersEmpty.hidden = true;
    elements.papersLoadMore.hidden = true;
    return;
  }
  renderPaperFacets();
  const matches = matchingPapers();
  const visible = matches.slice(0, state.paperLimit);
  elements.papersList.innerHTML = visible.map(paperItemTemplate).join('');
  const hasFilters = Boolean(
    state.paperQuery || state.paperYears.size > 0 || state.paperConferences.size > 0
    || state.paperAuthors.size > 0 || state.paperInstitutions.size > 0
  );
  elements.papersResultsCount.textContent = hasFilters
    ? `${matches.length} of ${arxivPapers.length} papers`
    : `${arxivPapers.length} ${arxivPapers.length === 1 ? 'paper' : 'papers'}`;
  elements.papersEmpty.hidden = matches.length !== 0;
  elements.papersLoadMore.hidden = visible.length >= matches.length;
  if (!elements.papersLoadMore.hidden) {
    const remaining = matches.length - visible.length;
    elements.papersLoadMore.textContent = `Show ${Math.min(50, remaining)} more of ${remaining}`;
  }

  elements.count.textContent = matches.length === arxivPapers.length
    ? String(arxivPapers.length)
    : `${matches.length} / ${arxivPapers.length}`;
  elements.summaryLabel.textContent = 'research papers';
  elements.clearSearch.hidden = !state.paperQuery;
  elements.clearPaperFilters.hidden = state.paperYears.size === 0 && state.paperConferences.size === 0
    && state.paperAuthors.size === 0 && state.paperInstitutions.size === 0;
}

let paperRenderFrame = 0;
function schedulePaperRender() {
  window.cancelAnimationFrame(paperRenderFrame);
  paperRenderFrame = window.requestAnimationFrame(() => {
    paperRenderFrame = 0;
    renderPapers();
  });
}

function countPaperFacetValues(papers, facet) {
  const counts = new Map();
  papers.forEach((paper) => {
    paperFacetValues(paper, facet).forEach((value) => {
      counts.set(value, (counts.get(value) || 0) + 1);
    });
  });
  return counts;
}

function paperFacetSelection(facet) {
  if (facet === 'year') return state.paperYears;
  if (facet === 'conference') return state.paperConferences;
  if (facet === 'author') return state.paperAuthors;
  return state.paperInstitutions;
}

let paperFacetGlobalCounts = {};
let paperFacetUniverse = {};

function rebuildPaperFacetIndex() {
  const entries = {};
  ['year', 'conference', 'author', 'institution'].forEach((facet) => {
    entries[facet] = countPaperFacetValues(arxivPapers, facet);
  });
  paperFacetGlobalCounts = entries;

  const universes = {};
  ['year', 'conference', 'author', 'institution'].forEach((facet) => {
    const counts = [...paperFacetGlobalCounts[facet]];
    if (facet === 'year') counts.sort((a, b) => Number(b[0]) - Number(a[0]));
    else if (facet === 'conference') {
      counts.sort((a, b) => {
        if (a[0] === 'arXiv') return 1;
        if (b[0] === 'arXiv') return -1;
        return b[1] - a[1] || a[0].localeCompare(b[0]);
      });
    } else {
      counts.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }));
    }
    universes[facet] = counts.map(([value]) => value);
  });
  paperFacetUniverse = universes;
}

function rankedPaperFacetValues(facet, counts) {
  if (facet !== 'author' && facet !== 'institution') return paperFacetUniverse[facet];
  const globalCounts = paperFacetGlobalCounts[facet];
  const selected = paperFacetSelection(facet);
  const query = (facet === 'author' ? state.paperAuthorQuery : state.paperInstitutionQuery)
    .trim().toLocaleLowerCase();
  const ranked = paperFacetUniverse[facet]
    .filter((value) => !query || value.toLocaleLowerCase().includes(query))
    .map((value) => ({
    value,
    count: counts.get(value) || 0,
    globalCount: globalCounts.get(value) || 0
  })).sort((left, right) => (
    right.count - left.count
    || right.globalCount - left.globalCount
    || left.value.localeCompare(right.value, undefined, { sensitivity: 'base' })
  ));

  if (facet === 'author') return ranked.map((entry) => entry.value);
  const visible = ranked.slice(0, 60).map((entry) => entry.value);
  selected.forEach((value) => {
    if ((!query || value.toLocaleLowerCase().includes(query)) && !visible.includes(value)) visible.push(value);
  });
  return visible;
}

function paperFacetFilterTemplate(value, count, facet) {
  const selected = paperFacetSelection(facet).has(value);
  const disabled = count === 0 && !selected;
  return `
    <li>
      <label class="paper-facet-filter${disabled ? ' is-unavailable' : ''}">
        <input type="checkbox" data-paper-${facet}="${escapeHtml(value)}"${selected ? ' checked' : ''}${disabled ? ' disabled' : ''} />
        <span class="paper-facet-check" aria-hidden="true">✓</span>
        <span class="paper-facet-filter-name" title="${escapeHtml(value)}">${escapeHtml(value)}</span>
        <span class="blog-company-filter-count">${count}</span>
      </label>
    </li>`;
}

function createPaperFacetItem(value, count, facet) {
  const template = document.createElement('template');
  template.innerHTML = paperFacetFilterTemplate(value, count, facet).trim();
  return template.content.firstElementChild;
}

const paperAuthorVirtualRowHeight = 34;
const paperAuthorVirtualOverscan = 8;

function renderVirtualPaperAuthorFacet(element) {
  const values = element.paperFacetValues || [];
  const counts = element.paperFacetCounts || new Map();
  const scrollTop = element.scrollTop;
  const viewportHeight = element.clientHeight || 240;
  const visibleStart = Math.floor(element.scrollTop / paperAuthorVirtualRowHeight);
  const start = Math.max(0, visibleStart - paperAuthorVirtualOverscan);
  const end = Math.min(
    values.length,
    Math.ceil((element.scrollTop + viewportHeight) / paperAuthorVirtualRowHeight) + paperAuthorVirtualOverscan
  );
  const fragment = document.createDocumentFragment();
  const spacer = document.createElement('li');
  spacer.className = 'paper-facet-virtual-spacer';
  spacer.style.height = `${values.length * paperAuthorVirtualRowHeight}px`;
  spacer.setAttribute('aria-hidden', 'true');
  fragment.append(spacer);

  for (let index = start; index < end; index += 1) {
    const value = values[index];
    const item = createPaperFacetItem(value, counts.get(value) || 0, 'author');
    item.classList.add('paper-facet-virtual-item');
    item.style.top = `${index * paperAuthorVirtualRowHeight}px`;
    item.setAttribute('aria-posinset', String(index + 1));
    item.setAttribute('aria-setsize', String(values.length));
    fragment.append(item);
  }
  element.replaceChildren(fragment);
  element.scrollTop = scrollTop;
}

function initializeVirtualPaperAuthorFacet(element) {
  if (element.paperVirtualScrollBound) return;
  element.paperVirtualScrollBound = true;
  element.classList.add('paper-facet-filters--virtual');
  element.addEventListener('scroll', () => {
    if (element.paperVirtualFrame) return;
    element.paperVirtualFrame = window.requestAnimationFrame(() => {
      element.paperVirtualFrame = 0;
      renderVirtualPaperAuthorFacet(element);
    });
  }, { passive: true });
}

function renderPaperFacet(facet, element) {
  const matchingOtherFacets = arxivPapers.filter((paper) => paperMatchesCurrentFilters(paper, facet));
  const counts = countPaperFacetValues(matchingOtherFacets, facet);
  const values = rankedPaperFacetValues(facet, counts);
  if (facet === 'author') {
    initializeVirtualPaperAuthorFacet(element);
    element.paperFacetValues = values;
    element.paperFacetCounts = counts;
    renderVirtualPaperAuthorFacet(element);
    return;
  }
  const previousValues = element.paperFacetValues || [];
  const orderChanged = previousValues.length !== values.length
    || values.some((value, index) => value !== previousValues[index]);
  if (!element.paperFacetItems) {
    element.paperFacetItems = new Map();
    const fragment = document.createDocumentFragment();
    values.forEach((value) => {
      const item = createPaperFacetItem(value, counts.get(value) || 0, facet);
      element.paperFacetItems.set(value, item);
      fragment.append(item);
    });
    element.replaceChildren(fragment);
  } else if (orderChanged) {
    const scrollTop = element.scrollTop;
    const fragment = document.createDocumentFragment();
    values.forEach((value) => {
      let item = element.paperFacetItems.get(value);
      if (!item) {
        item = createPaperFacetItem(value, counts.get(value) || 0, facet);
        element.paperFacetItems.set(value, item);
      }
      fragment.append(item);
    });
    element.replaceChildren(fragment);
    element.scrollTop = scrollTop;
  }
  element.paperFacetValues = values;
  values.forEach((value) => {
    const item = element.paperFacetItems.get(value);
    const count = counts.get(value) || 0;
    const selected = paperFacetSelection(facet).has(value);
    const disabled = count === 0 && !selected;
    const input = item.querySelector('input');
    input.checked = selected;
    input.disabled = disabled;
    item.querySelector('.paper-facet-filter').classList.toggle('is-unavailable', disabled);
    item.querySelector('.blog-company-filter-count').textContent = String(count);
  });
}

function renderPaperFacets() {
  renderPaperFacet('year', elements.paperYearFilters);
  renderPaperFacet('conference', elements.paperConferenceFilters);
  renderPaperFacet('author', elements.paperAuthorFilters);
  renderPaperFacet('institution', elements.paperInstitutionFilters);
}

function renderPaperMetadata() {
  elements.paperKeywordList.innerHTML = (arxivPapersMeta.keywords || [])
    .map((keyword) => `<li>${escapeHtml(keyword)}</li>`)
    .join('');
  const generatedDate = String(arxivPapersMeta.generatedAt || '').slice(0, 10);
  elements.papersUpdated.textContent = generatedDate
    ? `Snapshot ${formatPostDate(generatedDate)}`
    : 'Static snapshot';
}

function bookHaystack(book) {
  return [
    book.title,
    book.subtitle,
    book.publisher,
    book.format,
    book.note,
    book.isbn,
    String(book.year || ''),
    ...(book.authors || [])
  ].join(' ').toLowerCase();
}

function matchingBooks(books) {
  const query = state.bookQuery.trim().toLowerCase();
  if (!query) return books;
  return books.filter((book) => bookHaystack(book).includes(query));
}

function bookLinkTemplate(url, label) {
  if (!url) return '';
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}${externalIcon}</a>`;
}

function bookItemTemplate(book) {
  const authorLabel = (book.authors || []).join(', ');
  const meta = [book.publisher, book.year ? String(book.year) : '', book.isbn ? `ISBN ${book.isbn}` : '']
    .filter(Boolean)
    .map((part) => `<span>${escapeHtml(part)}</span>`)
    .join('');

  return `
    <li class="book-card">
      <article>
        <a class="book-cover" href="${escapeHtml(book.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
          <img src="${escapeHtml(book.cover)}" alt="" loading="lazy" decoding="async" />
        </a>
        <div class="book-body">
          <div class="book-card-topline">
            <span class="book-format book-format--${escapeHtml(String(book.format || 'book').toLowerCase().replace(/[^a-z]+/g, '-'))}">${escapeHtml(book.format || 'Book')}</span>
          </div>
          <h4><a href="${escapeHtml(book.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(book.title)}</a></h4>
          ${book.subtitle ? `<p class="book-subtitle">${escapeHtml(book.subtitle)}</p>` : ''}
          <p class="book-authors">${escapeHtml(authorLabel)}</p>
          ${book.note ? `<p class="book-note">${escapeHtml(book.note)}</p>` : ''}
          <div class="book-card-footer">
            <div class="book-meta">${meta}</div>
            <div class="book-actions">
              ${bookLinkTemplate(book.url, book.linkLabel || 'Publisher')}
              ${bookLinkTemplate(book.altUrl, book.altLabel || 'Alternate')}
            </div>
          </div>
        </div>
      </article>
    </li>`;
}

function renderBooks() {
  const rendered = bookSections
    .map((section) => ({ section, books: matchingBooks(section.books || []) }))
    .filter((entry) => entry.books.length > 0);
  const total = rendered.reduce((sum, entry) => sum + entry.books.length, 0);

  elements.booksToc.innerHTML = rendered
    .map(({ section, books }) => (
      `<a href="#books-${escapeHtml(section.id)}">${escapeHtml(section.title)}<span>${books.length}</span></a>`
    ))
    .join('');
  elements.booksToc.hidden = rendered.length < 2;

  elements.booksSections.innerHTML = rendered
    .map(({ section, books }) => `
      <section class="book-section" id="books-${escapeHtml(section.id)}" aria-labelledby="books-${escapeHtml(section.id)}-title">
        <div class="book-section-header">
          <h3 id="books-${escapeHtml(section.id)}-title">${escapeHtml(section.title)}</h3>
          ${section.intro ? `<p>${escapeHtml(section.intro)}</p>` : ''}
        </div>
        <ol class="books-list">${books.map(bookItemTemplate).join('')}</ol>
      </section>`)
    .join('');

  elements.booksEmpty.hidden = total !== 0;
  elements.booksUpdated.textContent = booksLibrary.updatedAt
    ? `Updated ${formatPostDate(booksLibrary.updatedAt)}`
    : '';

  elements.count.textContent = total === allBooks.length
    ? String(allBooks.length)
    : `${total} / ${allBooks.length}`;
  elements.summaryLabel.textContent = total === 1 ? 'book' : 'books';
  elements.clearSearch.hidden = !state.bookQuery;
}

function communityHaystack(item) {
  const related = [...(item.socials || []), ...(item.programs || [])]
    .flatMap((entry) => [entry.name, entry.meta]);
  return [
    item.name,
    item.kind,
    item.description,
    item.evidence,
    ...related
  ].join(' ').toLowerCase();
}

function matchingCommunityItems(items) {
  const query = state.communityQuery.trim().toLowerCase();
  return query ? items.filter((item) => communityHaystack(item).includes(query)) : items;
}

function communityRelatedTemplate(title, items = []) {
  if (!items.length) return '';
  return `
    <div class="community-related">
      <p>${escapeHtml(title)}</p>
      <ul>
        ${items.map((entry) => `
          <li>
            <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer">
              <span>${escapeHtml(entry.name)}</span>${externalIcon}
            </a>
            <small>${escapeHtml(entry.meta || '')}</small>
          </li>`).join('')}
      </ul>
    </div>`;
}

function communityItemTemplate(item) {
  return `
    <li class="community-card">
      <article>
        <div class="community-card-topline">
          <span class="community-kind">${escapeHtml(item.kind)}</span>
        </div>
        <h4><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a></h4>
        <p class="community-description">${escapeHtml(item.description)}</p>
        <div class="community-related-groups">
          ${communityRelatedTemplate('Social & community', item.socials)}
          ${communityRelatedTemplate('Programs & events', item.programs)}
        </div>
        <p class="community-evidence">
          <strong>Source note</strong>${escapeHtml(item.evidence)}
          ${item.sourceUrl ? `<a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Verify${externalIcon}</a>` : ''}
        </p>
        <a class="community-action" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(item.action)}${externalIcon}
        </a>
      </article>
    </li>`;
}

function renderCommunity() {
  const rendered = communitySections
    .map((section) => ({ section, items: matchingCommunityItems(section.items || []) }))
    .filter((entry) => entry.items.length > 0);
  const total = rendered.reduce((sum, entry) => sum + entry.items.length, 0);

  elements.communitySections.innerHTML = rendered.map(({ section, items }) => `
    <section class="community-section" aria-labelledby="community-${escapeHtml(section.id)}-title">
      <div class="community-section-header">
        <p>${escapeHtml(section.eyebrow || '')}</p>
        <h3 id="community-${escapeHtml(section.id)}-title">${escapeHtml(section.title)}</h3>
        <span>${escapeHtml(section.intro || '')}</span>
      </div>
      <ul class="community-grid">${items.map(communityItemTemplate).join('')}</ul>
    </section>`).join('');

  elements.communityEmpty.hidden = total !== 0;
  elements.communityUpdated.textContent = communityLibrary.updatedAt
    ? `Reviewed ${formatPostDate(communityLibrary.updatedAt)}`
    : '';
  elements.count.textContent = total === allCommunityItems.length
    ? String(allCommunityItems.length)
    : `${total} / ${allCommunityItems.length}`;
  elements.summaryLabel.textContent = total === 1 ? 'community resource' : 'community resources';
  elements.clearSearch.hidden = !state.communityQuery;
}

function showView(view) {
  const selectedView = ['directory', 'blogs', 'papers', 'books', 'community'].includes(view) ? view : 'directory';
  state.activeView = selectedView;
  const views = {
    directory: [elements.directoryView, elements.navDirectory],
    blogs: [elements.blogsView, elements.navBlogs],
    papers: [elements.papersView, elements.navPapers],
    books: [elements.booksView, elements.navBooks],
    community: [elements.communityView, elements.navCommunity]
  };

  Object.entries(views).forEach(([name, [viewElement, navElement]]) => {
    const isActive = name === selectedView;
    viewElement.hidden = !isActive;
    navElement.classList.toggle('is-active', isActive);
    if (isActive) navElement.setAttribute('aria-current', 'page');
    else navElement.removeAttribute('aria-current');
  });

  if (selectedView === 'papers') {
    elements.search.placeholder = 'Search papers';
    elements.search.setAttribute('aria-label', 'Search papers');
    elements.search.value = state.paperQuery;
    if (paperDataStatus === 'loaded') renderPapers();
    else void ensurePaperData();
  } else if (selectedView === 'books') {
    elements.search.placeholder = 'Search books';
    elements.search.setAttribute('aria-label', 'Search books');
    elements.search.value = state.bookQuery;
    renderBooks();
  } else if (selectedView === 'community') {
    elements.search.placeholder = 'Search community';
    elements.search.setAttribute('aria-label', 'Search community resources');
    elements.search.value = state.communityQuery;
    renderCommunity();
  } else {
    elements.search.placeholder = 'Search companies';
    elements.search.setAttribute('aria-label', 'Search companies');
    elements.search.value = state.query || state.country;
    render();
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function navigateToView(event, view) {
  event.preventDefault();
  const targetHash = event.currentTarget.getAttribute('href');
  if (window.location.hash !== targetHash) {
    window.history.pushState(null, '', targetHash);
  }
  showView(view);
  setFocusReportOpen(false);
}

function viewForHash(hash = window.location.hash) {
  if (hash === '#blogs' || hash === '#focus-report') return 'blogs';
  if (hash === '#papers') return 'papers';
  if (hash === '#books' || hash.startsWith('#books-')) return 'books';
  if (hash === '#community') return 'community';
  return 'directory';
}

function syncViewFromLocation() {
  const showFocusReport = window.location.hash === '#focus-report' && Boolean(companyFocus);
  showView(viewForHash());
  setFocusReportOpen(showFocusReport, { scroll: showFocusReport });
}

function clearSearch() {
  if (state.activeView === 'papers') {
    state.paperQuery = '';
    state.paperLimit = 50;
    elements.search.value = '';
    renderPapers();
    return;
  }
  if (state.activeView === 'books') {
    state.bookQuery = '';
    elements.search.value = '';
    renderBooks();
    return;
  }
  if (state.activeView === 'community') {
    state.communityQuery = '';
    elements.search.value = '';
    renderCommunity();
    return;
  }
  state.query = '';
  state.country = '';
  elements.search.value = '';
  render();
}

function openInclusionMethod() {
  if (typeof elements.modal.showModal === 'function') elements.modal.showModal();
}

function closeInclusionMethod() {
  elements.modal.close();
}

function openCompanyVerification(companyName) {
  const evidence = companyVerification[companyName];
  if (!evidence) return;
  const sources = (evidence.sources || []).map((source) => `
    <li class="verification-source">
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
        <span>${escapeHtml(source.label)}</span>${externalIcon}
      </a>
      <blockquote>“${escapeHtml(source.quote)}”</blockquote>
    </li>`).join('');
  elements.verificationContent.innerHTML = `
    <p class="verification-status"><span aria-hidden="true">✓</span> Source-backed inclusion</p>
    <h3 id="verification-company-name">${escapeHtml(companyName)}</h3>
    <p class="verification-criterion">${escapeHtml(evidence.criterion)}</p>
    <p class="verification-summary">${escapeHtml(evidence.summary)}</p>
    <h4>Evidence</h4>
    <ul class="verification-sources">${sources}</ul>
    <p class="verification-note">The linked passage is the inclusion evidence; it is not an endorsement or a validation of broader product claims.</p>`;
  if (typeof elements.verificationModal.showModal === 'function') {
    elements.verificationModal.showModal();
  }
}

function closeCompanyVerification() {
  elements.verificationModal.close();
}

function openPaperMethod() {
  if (typeof elements.paperMethodModal.showModal === 'function') elements.paperMethodModal.showModal();
}

function closePaperMethod() {
  elements.paperMethodModal.close();
}

elements.search.addEventListener('input', (event) => {
  if (state.activeView === 'papers') {
    state.paperQuery = event.target.value;
    state.paperLimit = 50;
    schedulePaperRender();
    return;
  }
  if (state.activeView === 'books') {
    state.bookQuery = event.target.value;
    renderBooks();
    return;
  }
  if (state.activeView === 'community') {
    state.communityQuery = event.target.value;
    renderCommunity();
    return;
  }
  state.country = '';
  state.query = event.target.value;
  render();
});

elements.search.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearSearch();
    elements.search.blur();
  }
});

elements.clearSearch.addEventListener('click', () => {
  clearSearch();
  elements.search.focus();
});

elements.sortableHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const key = header.dataset.key;
    if (!key) return;
    if (state.sortKey === key) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = key;
      state.sortDirection = ['githubStars', 'postCount'].includes(key) ? 'desc' : 'asc';
    }
    render();
  });
});

document.addEventListener('keydown', (event) => {
  const isTyping = event.target instanceof Element
    && event.target.matches('input, textarea, select, [contenteditable="true"]');
  if (event.key === '/' && !isTyping) {
    event.preventDefault();
    elements.search.focus();
  }
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-retry-paper-load]')) {
    paperDataStatus = 'idle';
    void ensurePaperData();
    return;
  }

  const verificationButton = event.target.closest('[data-verification-company]');
  if (verificationButton) {
    openCompanyVerification(verificationButton.dataset.verificationCompany);
    return;
  }

  const locationFilter = event.target.closest('[data-country-filter]');
  if (locationFilter) {
    if (state.country === locationFilter.dataset.countryFilter) {
      clearSearch();
      return;
    }

    state.query = '';
    state.country = locationFilter.dataset.countryFilter;
    elements.search.value = state.country;
    render();
    return;
  }

  if (event.target.closest('[data-reset]')) {
    clearSearch();
    elements.search.focus();
  }
});

elements.navDirectory.addEventListener('click', (event) => navigateToView(event, 'directory'));
elements.navBlogs.addEventListener('click', (event) => navigateToView(event, 'blogs'));
elements.navPapers.addEventListener('click', (event) => navigateToView(event, 'papers'));
elements.navBooks.addEventListener('click', (event) => navigateToView(event, 'books'));
elements.navCommunity.addEventListener('click', (event) => navigateToView(event, 'community'));
window.addEventListener('popstate', () => {
  syncViewFromLocation();
});

elements.papersSort.addEventListener('change', (event) => {
  state.paperSort = event.target.value;
  state.paperLimit = 50;
  renderPapers();
});

elements.paperYearFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-paper-year]');
  if (!input) return;
  if (input.checked) state.paperYears.add(input.dataset.paperYear);
  else state.paperYears.delete(input.dataset.paperYear);
  state.paperLimit = 50;
  renderPapers();
});

elements.paperConferenceFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-paper-conference]');
  if (!input) return;
  if (input.checked) state.paperConferences.add(input.dataset.paperConference);
  else state.paperConferences.delete(input.dataset.paperConference);
  state.paperLimit = 50;
  renderPapers();
});

elements.paperAuthorFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-paper-author]');
  if (!input) return;
  if (input.checked) state.paperAuthors.add(input.dataset.paperAuthor);
  else state.paperAuthors.delete(input.dataset.paperAuthor);
  state.paperLimit = 50;
  renderPapers();
});

elements.paperInstitutionFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-paper-institution]');
  if (!input) return;
  if (input.checked) state.paperInstitutions.add(input.dataset.paperInstitution);
  else state.paperInstitutions.delete(input.dataset.paperInstitution);
  state.paperLimit = 50;
  renderPapers();
});

function schedulePaperFacetSearchRender(facet, element) {
  window.cancelAnimationFrame(element.paperFacetSearchFrame || 0);
  element.paperFacetSearchFrame = window.requestAnimationFrame(() => {
    element.paperFacetSearchFrame = 0;
    renderPaperFacet(facet, element);
  });
}

elements.paperAuthorSearch.addEventListener('input', (event) => {
  state.paperAuthorQuery = event.target.value;
  elements.paperAuthorFilters.scrollTop = 0;
  schedulePaperFacetSearchRender('author', elements.paperAuthorFilters);
});

elements.paperInstitutionSearch.addEventListener('input', (event) => {
  state.paperInstitutionQuery = event.target.value;
  elements.paperInstitutionFilters.scrollTop = 0;
  schedulePaperFacetSearchRender('institution', elements.paperInstitutionFilters);
});

function clearPaperFacetSearches() {
  state.paperAuthorQuery = '';
  state.paperInstitutionQuery = '';
  elements.paperAuthorSearch.value = '';
  elements.paperInstitutionSearch.value = '';
  elements.paperAuthorFilters.scrollTop = 0;
  elements.paperInstitutionFilters.scrollTop = 0;
}

elements.clearPaperFilters.addEventListener('click', () => {
  state.paperYears.clear();
  state.paperConferences.clear();
  state.paperAuthors.clear();
  state.paperInstitutions.clear();
  clearPaperFacetSearches();
  state.paperLimit = 50;
  elements.paperYearFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  elements.paperConferenceFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  elements.paperAuthorFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  elements.paperInstitutionFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  renderPapers();
});

elements.papersLoadMore.addEventListener('click', () => {
  state.paperLimit += 50;
  renderPapers();
});

elements.papersEmpty.addEventListener('click', (event) => {
  if (!event.target.closest('[data-reset-papers]')) return;
  state.paperYears.clear();
  state.paperConferences.clear();
  state.paperAuthors.clear();
  state.paperInstitutions.clear();
  clearPaperFacetSearches();
  elements.paperYearFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  elements.paperConferenceFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  elements.paperAuthorFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  elements.paperInstitutionFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  clearSearch();
  elements.search.focus();
});

elements.blogCompanyFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-blog-company]');
  if (!input) return;

  if (input.checked) {
    state.blogCompanies.add(input.dataset.blogCompany);
  } else {
    state.blogCompanies.delete(input.dataset.blogCompany);
  }
  renderBlogs();
});

elements.blogTypeFilters.addEventListener('change', (event) => {
  const input = event.target.closest('[data-blog-type]');
  if (!input) return;

  if (input.checked) {
    state.blogTypes.add(input.dataset.blogType);
  } else {
    state.blogTypes.delete(input.dataset.blogType);
  }
  renderBlogs();
});

if (companyFocus) {
  elements.focusReportToggle.addEventListener('click', openFocusReport);
  elements.focusReportBackLinks.forEach((link) => {
    link.addEventListener('click', (event) => navigateToView(event, 'blogs'));
  });
} else {
  elements.focusReportToggle.hidden = true;
}

elements.blogNeurosymbolicToggle.addEventListener('click', () => {
  state.blogNeurosymbolicOnly = !state.blogNeurosymbolicOnly;
  syncBlogNeurosymbolicToggle();
  renderBlogs();
});

elements.clearBlogFilters.addEventListener('click', () => {
  state.blogCompanies.clear();
  state.blogTypes.clear();
  state.blogNeurosymbolicOnly = false;
  elements.blogCompanyFilters.querySelectorAll('[data-blog-company]').forEach((input) => {
    input.checked = false;
  });
  elements.blogTypeFilters.querySelectorAll('[data-blog-type]').forEach((input) => {
    input.checked = false;
  });
  syncBlogNeurosymbolicToggle();
  renderBlogs();
});

const mobileFilterLayout = window.matchMedia('(max-width: 74rem)');

function setBlogFiltersCollapsed(collapsed) {
  elements.blogFilters.classList.toggle('is-collapsed', collapsed);
  elements.blogFilterToggle.setAttribute('aria-expanded', String(!collapsed));
}

function setPaperFiltersCollapsed(collapsed) {
  elements.paperFilterPanel.classList.toggle('is-collapsed', collapsed);
  elements.paperFilterToggle.setAttribute('aria-expanded', String(!collapsed));
}

setBlogFiltersCollapsed(mobileFilterLayout.matches);
setPaperFiltersCollapsed(mobileFilterLayout.matches);
mobileFilterLayout.addEventListener('change', (event) => {
  setBlogFiltersCollapsed(event.matches);
  setPaperFiltersCollapsed(event.matches);
});

elements.blogFilterToggle.addEventListener('click', () => {
  setBlogFiltersCollapsed(elements.blogFilterToggle.getAttribute('aria-expanded') === 'true');
});

elements.paperFilterToggle.addEventListener('click', () => {
  setPaperFiltersCollapsed(elements.paperFilterToggle.getAttribute('aria-expanded') === 'true');
});

elements.methodLinks.forEach((link) => link?.addEventListener('click', openInclusionMethod));
elements.close.addEventListener('click', closeInclusionMethod);
elements.modal.addEventListener('cancel', closeInclusionMethod);
elements.modal.addEventListener('click', (event) => {
  if (event.target === elements.modal) closeInclusionMethod();
});
elements.verificationClose.addEventListener('click', closeCompanyVerification);
elements.verificationModal.addEventListener('cancel', closeCompanyVerification);
elements.verificationModal.addEventListener('click', (event) => {
  if (event.target === elements.verificationModal) closeCompanyVerification();
});
elements.verificationMethodLink.addEventListener('click', () => {
  closeCompanyVerification();
  openInclusionMethod();
});
elements.paperMethodButton.addEventListener('click', openPaperMethod);
elements.paperMethodClose.addEventListener('click', closePaperMethod);
elements.paperMethodModal.addEventListener('cancel', closePaperMethod);
elements.paperMethodModal.addEventListener('click', (event) => {
  if (event.target === elements.paperMethodModal) closePaperMethod();
});

render();
renderBlogFilters();
renderBlogs();
renderCommunity();
if (viewForHash() !== 'directory') syncViewFromLocation();
