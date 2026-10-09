/**
 * SEO FOUNDATION — Women Without Borders Hub
 * Single source of truth for site identity, metadata and structured data.
 *
 * Google guidance applied here:
 *  - Same organization name used on the site, in metadata and structured data.
 *  - No giant keywords meta tag — SEO is built on real content, titles,
 *    headings, internal links and structured data instead.
 *  - Organization schema is placed only on the homepage (see Home.jsx),
 *    not on every page.
 *  - No invented domain: set SITE.url once the domain is purchased and
 *    canonical/OG/absolute breadcrumb URLs activate automatically.
 */

export const SITE = {
  // 1. Website name — used consistently in branding, metadata and schema.
  name: 'Women Without Borders Hub',

  // Primary site title (Home page SEO title).
  homeTitle:
    'Women Without Borders Hub | Empowering Girls & Young Women in Kakuma',

  // Set once the domain is purchased, e.g. 'https://www.example.org'
  // Left null on purpose — we must not invent a domain.
  url: null,

  // Official logo file — add when provided (used in Organization schema).
  logo: null,

  // 3. Website descriptions.
  description:
    'Women Without Borders Hub is a community-led organization in Kakuma, Turkana County, Kenya, creating opportunities for vulnerable girls, teenage mothers and young women through education, literacy, mentorship, health support, practical skills and economic empowerment.',
  shortDescription:
    'Creating opportunities for vulnerable girls, teenage mothers and young women through education, skills, mentorship, health and economic empowerment in Kakuma, Kenya.',

  // 4. Geographic area (from the constitution).
  location: 'Kakuma, Turkana County, Kenya',
  address: {
    streetAddress: 'Kakuma 3, Zone 2, Block 3',
    addressRegion: 'Turkana County',
    addressCountry: 'Kenya',
  },
  postalAddress: 'P.O. Box 01-30501, Kenya',

  // Official contact details — add when provided (schema + contact page).
  email: null,
  telephone: null,
  // e.g. ['https://facebook.com/...', 'https://youtube.com/...', ...]
  sameAs: [],

  // 10–12. Mission, vision and core values (from the constitution).
  mission:
    'Our mission is to remove barriers to education and opportunity for vulnerable girls, teenage mothers and young women by providing educational support, literacy, mentorship, health support, practical skills and pathways toward economic empowerment and self-reliance.',
  vision:
    'A future where every girl and young woman in Kakuma can learn, develop her potential, build confidence and secure an independent future.',
  values: [
    'Education',
    'Integrity',
    'Equality',
    'Empowerment',
    'Dignity',
    'Inclusion',
    'Respect',
    'Community Leadership',
    'Partnership',
    'Accountability',
    'Learning',
  ],

  // 5. Main audiences (primary first).
  primaryAudiences: ['Vulnerable girls', 'Teenage mothers', 'Young women'],
  communities: ['Refugee communities', 'Host communities'],
}


/**
 * Per-page SEO. Titles follow "Page title | Women Without Borders Hub";
 * the home page uses the stronger dedicated SEO title.
 * Descriptions are page-specific where it helps; otherwise the short
 * organization description is used.
 */
const pageSeo = {
  '/about/': {
    title: 'About',
    description:
      'Learn about Women Without Borders Hub — our mission, vision and core values, and our work with vulnerable girls, teenage mothers and young women in Kakuma, Turkana County, Kenya.',
  },
  '/about/our-team/': {
    title: 'Our Team',
    description:
      'Meet the team behind Women Without Borders Hub — the community leaders, educators and mentors supporting girls, teenage mothers and young women in Kakuma, Turkana County, Kenya.',
  },
  '/about/our-team/': {
    title: 'Our Team',
    description:
      'Meet the team behind Women Without Borders Hub — the community leaders, educators and mentors supporting girls, teenage mothers and young women in Kakuma, Turkana County, Kenya.',
  },
  '/programs/': {
    title: 'Programs',
    description:
      'Our programmes in Kakuma, Kenya: girls’ education and literacy, digital and technical skills, mentorship and life skills, menstrual dignity, SRHR, and livelihoods and economic empowerment.',
  },
  '/impact/': {
    title: 'Impact',
    description:
      'The impact of Women Without Borders Hub on girls, teenage mothers and young women in Kakuma — outcomes, reach and how we measure change.',
  },
  '/about/our-story/': {
    title: 'Our Story',
    fullTitle: 'Our Story | MaLua Lugazo: Building Hope for Girls in Kakuma',
    description:
      'MaLua Lugazo is a Somali refugee living in Kakuma Refugee Camp who founded Women Without Borders Hub so that every girl and young woman has a chance to learn, grow and lead.',
  },
  '/updates/': {
    title: 'Community Updates & Stories',
    description:
      'Community updates and stories from Women Without Borders Hub — scholarships, skills training, menstrual dignity, mentorship and livelihoods in Kakuma.',
  },
  '/impact/news/': {
    title: 'News',
    description:
      'News from Women Without Borders Hub — programme updates, partnerships and milestones from our work with girls and young women in Kakuma.',
  },
  '/impact/blogs/': {
    title: 'Blogs',
    description:
      'Blogs and reflections from Women Without Borders Hub — voices from our team, mentors and the women and girls we work with in Kakuma.',
  },
  '/impact/report/': {
    title: 'Report',
    description:
      'Reports from Women Without Borders Hub — outcomes, reach and how we measure change across our programmes in Kakuma, Kenya.',
  },
  '/impact/post/': {
    title: 'Post',
    description:
      'Posts and updates from Women Without Borders Hub — stories, announcements and highlights from our work in Kakuma, Kenya.',
  },
  '/get-involved/': {
    title: 'Get Involved',
    description:
      'Support vulnerable girls, teenage mothers and young women in Kakuma — donate, volunteer, become a member, mentor or partner with Women Without Borders Hub.',
  },
  '/resources/': {
    title: 'Resources',
    description:
      'Reports, toolkits and guides from Women Without Borders Hub on girls’ education, skills, mentorship, health and economic empowerment in Kakuma, Kenya.',
  },
  '/safeguarding/': {
    title: 'Safeguarding',
    description:
      'Our safeguarding and child protection commitments for girls, teenage mothers and young women in our programmes in Kakuma, Kenya.',
  },
  '/contact/': {
    title: 'Contact',
    description:
      'Contact Women Without Borders Hub in Kakuma 3, Turkana County, Kenya. We welcome enquiries from donors, development organizations, NGOs, schools, training institutions, health partners and volunteers.',
  },
}

// Get Involved sub-pages.
const involvementSeo = {
  donate: {
    title: 'Donate',
    description:
      'Donate to Women Without Borders Hub and fund education, literacy, skills, mentorship, health and economic empowerment for girls and young women in Kakuma, Kenya.',
  },
  volunteer: {
    title: 'Volunteer',
    description:
      'Volunteer with Women Without Borders Hub in Kakuma, Kenya — support vulnerable girls, teenage mothers and young women through education, skills and mentorship.',
  },
  membership: {
    title: 'Membership',
    description:
      'Become a member of Women Without Borders Hub and help shape our work with girls and young women in Kakuma, Kenya.',
  },
  mentor: {
    title: 'Mentor',
    description:
      'Become a mentor for vulnerable girls, teenage mothers and young women in Kakuma — share your experience through mentorship and life-skills guidance.',
  },
  partner: {
    title: 'Partner',
    description:
      'Partner with Women Without Borders Hub — schools, training institutions, health providers, NGOs, development organizations, donors and private-sector partners in Kakuma, Kenya.',
  },
}

/**
 * Program SEO details, keyed by slug.
 * Maps to the site's eight main SEO topics; used on program pages
 * and page metadata.
 */
const programSeo = {
  'education-literacy': {
    title: 'Education & Literacy',
    seoTopic: 'Girls’ Education in Kakuma',
    seoDescription:
      'Girls’ education in Kakuma: scholarships, literacy, remedial and second-chance education, learning materials and educational opportunities for vulnerable girls in Kenya.',
  },
  'digital-technical-skills': {
    title: 'Digital & Technical Skills',
    seoTopic: 'Digital & Vocational Skills for Young Women',
    seoDescription:
      'Digital skills, computer literacy and vocational training for young women in Kakuma — tailoring, fashion, beauty and hairdressing, and technical skills training.',
  },
  'mentorship-life-skills': {
    title: 'Mentorship & Life Skills',
    seoTopic: 'Mentorship & Life Skills for Girls',
    seoDescription:
      'Mentorship, life skills, leadership, career guidance, goal setting, financial literacy and confidence building for girls and young women in Kakuma, Kenya.',
  },
  'health-menstrual-dignity': {
    title: 'Health & Menstrual Dignity',
    seoTopic: 'Menstrual Health & Dignity',
    seoDescription:
      'Menstrual health and dignity in Kakuma: menstrual health education, menstrual products, health awareness and health referrals so girls stay in school.',
  },
  srhr: {
    title: 'Sexual & Reproductive Health and Rights (SRHR)',
    seoTopic: 'SRHR Education & Peer Education',
    seoDescription:
      'Age-appropriate, culturally sensitive SRHR education, peer education and community awareness for young people in Kakuma, Turkana County, Kenya.',
  },
  'livelihood-economic-empowerment': {
    title: 'Livelihood & Economic Empowerment',
    seoTopic: 'Livelihoods & Women’s Economic Empowerment',
    seoDescription:
      'Women’s livelihoods and economic empowerment in Kakuma: entrepreneurship, business mentorship, agriculture, apprenticeships, market linkages and employment referrals.',
  },
}

/**
 * Resolve the SEO metadata for a pathname.
 * Returns { title, description, noindex }.
 */
export function seoFor(pathname) {
  const path =
    pathname === '/' || pathname.endsWith('/') ? pathname : `${pathname}/`

  // Home page — strongest title + full description.
  if (path === '/') {
    return {
      title: SITE.homeTitle,
      description: SITE.description,
      noindex: false,
    }
  }

  // Static pages. An entry may carry a `fullTitle` when the SEO title
  // must not follow the default "Page title | Site name" pattern.
  if (pageSeo[path]) {
    return {
      title:
        pageSeo[path].fullTitle ||
        `${pageSeo[path].title} | ${SITE.name}`,
      description: pageSeo[path].description,
      noindex: false,
    }
  }

  // Dynamic program pages: "/programs/<slug>/".
  const programMatch = path.match(/^\/programs\/([^/]+)\/$/)
  if (programMatch) {
    const program = programSeo[programMatch[1]]
    if (program) {
      return {
        title: `${program.title} | ${SITE.name} — ${program.seoTopic}`,
        description: program.seoDescription,
        noindex: false,
      }
    }
    return {
      title: `Program not found | ${SITE.name}`,
      description: SITE.shortDescription,
      noindex: true,
    }
  }

  // Dynamic get-involved pages: "/get-involved/<slug>/".
  const involvedMatch = path.match(/^\/get-involved\/([^/]+)\/$/)
  if (involvedMatch) {
    const item = involvementSeo[involvedMatch[1]]
    if (item) {
      return {
        title: `${item.title} | ${SITE.name}`,
        description: item.description,
        noindex: false,
      }
    }
    return {
      title: `Page not found | ${SITE.name}`,
      description: SITE.shortDescription,
      noindex: true,
    }
  }

  // Unknown URL — noindex the 404 page.
  return {
    title: `Page not found | ${SITE.name}`,
    description: SITE.shortDescription,
    noindex: true,
  }
}

/**
 * Organization structured data (schema.org/Organization) for the homepage.
 * Only includes URL/logo/email/phone/sameAs once officially provided —
 * we do not invent them. Google recommends Organization schema on the
 * homepage or a single organization page, not on every page.
 */
export function organizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.streetAddress,
      addressRegion: SITE.address.addressRegion,
      addressCountry: SITE.address.addressCountry,
    },
    postalAddress: SITE.postalAddress,
    areaServed: [
      { '@type': 'City', name: 'Kakuma' },
      { '@type': 'AdministrativeArea', name: 'Turkana County' },
      { '@type': 'Country', name: 'Kenya' },
    ],
  }

  // Added automatically once the official details exist.
  if (SITE.url) schema.url = SITE.url
  if (SITE.logo) schema.logo = SITE.logo
  if (SITE.email) schema.email = SITE.email
  if (SITE.telephone) schema.telephone = SITE.telephone
  if (SITE.sameAs.length) schema.sameAs = SITE.sameAs

  return schema
}


