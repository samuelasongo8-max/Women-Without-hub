/**
 * Single source of truth for site navigation, breadcrumbs and page metadata.
 * URL structure mirrors the sitemap:
 *   /about/, /programs/, /programs/education-literacy/, /get-involved/donate/, ...
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
  { label: 'HOME', to: '/' },
  {
    label: 'ABOUT',
    to: '/about/',
    children: [
      { label: 'Our Story', to: '/about/our-story/' },
      { label: 'Our Team', to: '/about/our-team/' },
    ],
  },
  { label: 'PROGRAMS', to: '/programs/' },
  {
    label: 'IMPACT',
    to: '/impact/',
    children: [
      { label: 'News', to: '/impact/news/' },
      { label: 'Blogs', to: '/impact/blogs/' },
      { label: 'Report', to: '/impact/report/' },
    ],
  },
  { label: 'GET INVOLVED', to: '/get-involved/' },
  { label: 'CONTACT', to: '/contact/' },
]

// The prominent call to action.
export const donateCta = { label: 'DONATE', to: '/get-involved/donate/' }

// Program pages, keyed by slug under /programs/.
// Summaries reflect the eight main SEO topics (see src/data/seo.js).
export const programs = [
  {
    slug: 'education-literacy',
    title: 'Education & Literacy',
    summary:
      'Scholarships, literacy circles, remedial and second-chance education that keep girls in school and open educational opportunities for vulnerable girls in Kakuma.',
  },
  {
    slug: 'digital-technical-skills',
    title: 'Digital & Technical Skills',
    summary:
      'Computer literacy and digital skills bootcamps alongside vocational training in tailoring, fashion, beauty and hairdressing for young women.',
  },
  {
    slug: 'mentorship-life-skills',
    title: 'Mentorship & Life Skills',
    summary:
      'Mentorship, life skills, leadership, career guidance, goal setting and financial literacy that build confidence and self-reliance.',
  },
  {
    slug: 'health-menstrual-dignity',
    title: 'Health & Menstrual Dignity',
    summary:
      'Menstrual health education, menstrual products, health awareness and health referrals so no one misses school or work.',
  },
  {
    slug: 'srhr',
    title: 'Sexual & Reproductive Health and Rights (SRHR)',
    summary:
      'Age-appropriate, culturally sensitive SRHR education, peer education and community awareness built on respect and choice.',
  },
  {
    slug: 'livelihood-economic-empowerment',
    title: 'Livelihood & Economic Empowerment',
    summary:
      'Entrepreneurship, business mentorship, apprenticeships, market linkages and employment referrals for women’s economic empowerment.',
  },
]

// Get Involved pages, keyed by slug under /get-involved/.
export const involvement = [
  {
    slug: 'donate',
    title: 'Donate',
    summary: 'Your gift funds education, skills and dignity programmes directly.',
  },
  {
    slug: 'volunteer',
    title: 'Volunteer',
    summary: 'Give your time and skills to support women and girls in your community.',
  },
  {
    slug: 'membership',
    title: 'Membership',
    summary: 'Join as a member and help shape our priorities and programmes.',
  },
  {
    slug: 'mentor',
    title: 'Mentor',
    summary: 'Share your experience as a mentor for young women and girls.',
  },
  {
    slug: 'partner',
    title: 'Partner',
    summary: 'Partner with us as a funder, institution or community organisation.',
  },
]

// Route metadata: label + parent path, used for breadcrumbs.
// Keys are URL paths (trailing slash), parents may be null (top-level pages).
export const routeMeta = {
  '/': { label: 'Home', parent: null },
  '/about/': { label: 'About', parent: '/' },
  '/about/our-team/': { label: 'Our Team', parent: '/about/' },
  '/about/our-team/malua-lugazo/': {
    label: 'MaLua Lugazo',
    parent: '/about/our-team/',
  },
  '/programs/': { label: 'Programs', parent: '/' },
  '/impact/': { label: 'Impact', parent: '/' },
  '/about/our-story/': { label: 'Our Story', parent: '/about/' },
  '/updates/': { label: 'Community Updates & Stories', parent: '/' },
  '/impact/news/': { label: 'News', parent: '/impact/' },
  '/impact/blogs/': { label: 'Blogs', parent: '/impact/' },
  '/impact/report/': { label: 'Report', parent: '/impact/' },
  '/impact/post/': { label: 'Post', parent: '/impact/' },
  '/get-involved/': { label: 'Get Involved', parent: '/' },
  '/resources/': { label: 'Resources', parent: '/' },
  '/safeguarding/': { label: 'Safeguarding', parent: '/' },
  '/contact/': { label: 'Contact', parent: '/' },
}

programs.forEach((p) => {
  routeMeta[`/programs/${p.slug}/`] = {
    label: p.title,
    parent: '/programs/',
  }
})

routeMeta['/programs/livelihood-economic-empowerment/what-we-do/'] = {
  label: 'What We Do',
  parent: '/programs/livelihood-economic-empowerment/',
}

involvement.forEach((i) => {
  routeMeta[`/get-involved/${i.slug}/`] = {
    label: i.title,
    parent: '/get-involved/',
  }
})

/** Normalize a pathname to always carry a trailing slash, matching routeMeta keys. */
export function normalizePath(pathname) {
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

/** Build a breadcrumb trail (array of {label, to, isLast}) for a pathname. */
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
    trail.unshift({ label: meta.label, to: cursor })
    cursor = meta.parent
  }
  if (trail.length === 0) {
    trail.push({ label: 'Home', to: '/' })
  }
  return trail.map((crumb, i) => ({ ...crumb, isLast: i === trail.length - 1 }))
}
