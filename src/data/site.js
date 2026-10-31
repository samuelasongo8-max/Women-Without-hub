/**
 * Single source of truth for site navigation, breadcrumbs and page metadata.
 * URL structure mirrors the sitemap:
 *   /about/, /programs/, /programs/second-chance-education/, /get-involved/donate/, ...
 */

/**
 * Social links — single source of truth for the organisation's social
 * accounts. Reused by the hero social icon row and by the Organization
 * structured data ("sameAs" in src/data/seo.js) so the site never links to
 * two different Facebook pages.
 */

export const socialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61589301587817',
  linkedin: 'https://lnkd.in/p/dVuWVzM7',
}

// Main navigation shown in the header (in order).
export const mainNav = [
  { label: 'nav.home', to: '/' },
  {
    label: 'nav.about',
    to: '/about/',
    children: [
      { label: 'nav.ourStory', to: '/about/our-story/' },
      { label: 'nav.ourTeam', to: '/about/our-team/' },
    ],
  },
  { label: 'nav.programs', to: '/programs/' },
  {
    label: 'nav.impact',
    to: '/impact/',
    children: [
      { label: 'nav.news', to: '/impact/news/' },
      { label: 'nav.blogs', to: '/impact/blogs/' },
      { label: 'nav.report', to: '/impact/report/' },
    ],
  },
  { label: 'nav.getInvolved', to: '/get-involved/' },
  { label: 'nav.contact', to: '/contact/' },
]

// The prominent call to action.
export const donateCta = { label: 'nav.donate', to: '/get-involved/donate/' }

// Program pages, keyed by slug under /programs/.
// Summaries reflect the eight main SEO topics (see src/data/seo.js).
export const programs = [
  {
    slug: 'second-chance-education',
    titleKey: 'programs.cards.second-chance-education.title',
    summaryKey: 'programs.cards.second-chance-education.summary',
  },
  {
    slug: 'digital-technical-skills',
    titleKey: 'programs.cards.digital-technical-skills.title',
    summaryKey: 'programs.cards.digital-technical-skills.summary',
  },
  {
    slug: 'mentorship-life-skills',
    titleKey: 'programs.cards.mentorship-life-skills.title',
    summaryKey: 'programs.cards.mentorship-life-skills.summary',
  },
  {
    slug: 'health-menstrual-dignity',
    titleKey: 'programs.cards.health-menstrual-dignity.title',
    summaryKey: 'programs.cards.health-menstrual-dignity.summary',
  },
  {
    slug: 'srhr',
    titleKey: 'programs.cards.srhr.title',
    summaryKey: 'programs.cards.srhr.summary',
  },
  {
    slug: 'livelihood-economic-empowerment',
    titleKey: 'programs.cards.livelihood-economic-empowerment.title',
    summaryKey: 'programs.cards.livelihood-economic-empowerment.summary',
    whyImage: '/images/livelihood-why-it-matters',
    supportImage: '/images/livelihood-who-we-support',
    supportImageAlt: 'programs.livelihood.supportImageAlt',
    workingImage: '/images/livelihood-working-together',
  },
]

// Get Involved pages, keyed by slug under /get-involved/.
export const involvement = [
  {
    slug: 'donate',
    titleKey: 'getInvolvedCards.cardDonate.title',
    summaryKey: 'donate.subtitle',
  },
  {
    slug: 'volunteer',
    titleKey: 'getInvolvedCards.cardVolunteer.title',
    summaryKey: 'getInvolved.items.volunteer.summary',
  },
  {
    slug: 'membership',
    titleKey: 'footer.membership',
    summaryKey: 'getInvolved.items.membership.summary',
  },
  {
    slug: 'mentor',
    titleKey: 'getInvolvedCards.cardSkills.title',
    summaryKey: 'getInvolved.items.mentor.summary',
  },
  {
    slug: 'partner',
    titleKey: 'getInvolvedCards.cardPartner.title',
    summaryKey: 'getInvolved.items.partner.summary',
  },
]

// Route metadata: translation key + parent path, used for breadcrumbs.
// Keys are URL paths (trailing slash), parents may be null (top-level pages).
export const routeMeta = {
  '/': { labelKey: 'breadcrumb.home', parent: null },
  '/about/': { labelKey: 'breadcrumb.about', parent: '/' },
  '/about/our-team/': { labelKey: 'breadcrumb.ourTeam', parent: '/about/' },
  '/about/our-team/malua-lugazo/': {
    labelKey: 'profile.title',
    parent: '/about/our-team/',
  },
  '/programs/': { labelKey: 'breadcrumb.programs', parent: '/' },
  '/impact/': { labelKey: 'breadcrumb.impact', parent: '/' },
  '/about/our-story/': { labelKey: 'breadcrumb.ourStory', parent: '/about/' },
  '/updates/': { labelKey: 'breadcrumb.communityUpdates', parent: '/' },
  '/updates/building-pathways-for-women-and-girls/': {
    labelKey: 'updates.items.building-pathways-for-women-and-girls.title',
    parent: '/updates/',
  },
  '/updates/graduation-celebration-skills/': {
    labelKey: 'updates.items.graduation-celebration-skills.title',
    parent: '/updates/',
  },
  '/updates/health-advocacy/': {
    labelKey: 'updates.items.health-advocacy.title',
    parent: '/updates/',
  },
  '/impact/blogs/': { labelKey: 'breadcrumb.blogs', parent: '/impact/' },
  '/impact/report/': { labelKey: 'breadcrumb.report', parent: '/impact/' },
  '/impact/post/': { labelKey: 'breadcrumb.post', parent: '/impact/' },
  '/get-involved/': { labelKey: 'breadcrumb.getInvolved', parent: '/' },
  '/resources/': { labelKey: 'breadcrumb.resources', parent: '/' },
  '/safeguarding/': { labelKey: 'breadcrumb.safeguarding', parent: '/' },
  '/contact/': { labelKey: 'breadcrumb.contact', parent: '/' },
  '/privacy/': { labelKey: 'cookieConsent.policyTitle', parent: '/' },
}

programs.forEach((p) => {
  routeMeta[`/programs/${p.slug}/`] = {
    labelKey: p.titleKey,
    parent: '/programs/',
  }
})

routeMeta['/programs/livelihood-economic-empowerment/what-we-do/'] = {
  labelKey: 'programs.livelihood.whatWeDo.title',
  parent: '/programs/livelihood-economic-empowerment/',
}
routeMeta['/programs/livelihood-economic-empowerment/our-approach/'] = {
  labelKey: 'programs.livelihood.ourApproach.title',
  parent: '/programs/livelihood-economic-empowerment/',
}

involvement.forEach((i) => {
  routeMeta[`/get-involved/${i.slug}/`] = {
    labelKey: i.titleKey,
    parent: '/get-involved/',
  }
})

/** Normalize a pathname to always carry a trailing slash, matching routeMeta keys. */
export function normalizePath(pathname) {
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

/** Build a breadcrumb trail (array of {labelKey, to, isLast}) for a pathname. */
export function breadcrumbsFor(pathname) {
  const path = normalizePath(pathname)
  const trail = []
  let cursor = path
  // Walk up the parent chain (guard against cycles).
  const seen = new Set()
  while (cursor && !seen.has(cursor)) {
    seen.add(cursor)
    const meta = routeMeta[cursor]
    if (!meta) break
    trail.unshift({ labelKey: meta.labelKey, to: cursor })
    cursor = meta.parent
  }
  if (trail.length === 0) {
    trail.push({ labelKey: 'breadcrumb.home', to: '/' })
  }
  return trail.map((crumb, i) => ({ ...crumb, isLast: i === trail.length - 1 }))
}
