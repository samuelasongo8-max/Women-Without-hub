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
 *  - Use the confirmed Vercel production URL unless a custom domain is
 *    configured through VITE_SITE_URL.
 */

import { breadcrumbsFor, normalizePath, socialLinks } from './site.js'
import { DEFAULT_SITE_URL, ORG_NAME } from '../config/site.js'

/**
 * Normalize the configured site URL into a canonical absolute origin.
 *
 * Returns null when no URL is configured (or the value is the old
 * placeholder), so the site never publishes an invented domain:
 *  - '' / null / undefined      -> null
 *  - 'YOUR-DOMAIN' / 'https://YOUR-DOMAIN' -> null
 *  - 'example.org'              -> 'https://example.org'
 *  - 'https://example.org/'     -> 'https://example.org'
 *  - 'http://example.org'       -> 'https://example.org' (force https)
 */
export function normalizeSiteUrl(raw) {
  if (!raw || typeof raw !== 'string') return null

  let value = raw.trim()
  if (!value) return null

  // Guard against the historical placeholder still being present.
  if (/^https?:\/\/YOUR-DOMAIN$/i.test(value) || /^YOUR-DOMAIN$/i.test(value)) {
    return null
  }

  // Add a scheme when it is missing.
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`

  try {
    const url = new URL(value)
    // Force https and drop any trailing path/query/hash so the value is
    // a clean origin that can be used to build absolute URLs.
    return `https://${url.host}`
  } catch {
    return null
  }
}

export const SITE = {
  // 1. Website name — used consistently in branding, metadata and schema.
  name: ORG_NAME,

  // Primary site title (Home page SEO title).
  homeTitle: 'Empower girls in Kakuma, Kenya | Women Without Borders Hub',

  // Override VITE_SITE_URL when deploying to a verified custom domain.
  url: normalizeSiteUrl(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL),

  // Official logo file — add when provided (used in Organization schema).
  logo: null,

  // Default Open Graph / Twitter share image. Replace with a 1200×630
  // image when one is available (manual step — see notes after deploy).
  ogImage: '/images/og-home.jpg',

  // 3. Website descriptions.
  description:
    'Women Without Borders Hub empowers girls and young women in Kakuma, Kenya through education, mentorship, health support and practical skills.',
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
  // Official social profiles — shared with the hero icon row via
  // src/data/site.js so the site never links to two different Facebook pages.
  sameAs: [socialLinks.facebook, socialLinks.linkedin],

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
      `Learn about ${ORG_NAME} — our mission, vision and core values, and our work with vulnerable girls, teenage mothers and young women in Kakuma, Turkana County, Kenya.`,
  },
  '/about/our-team/': {
    title: 'Our Team',
    description:
      `Meet the team behind ${ORG_NAME} — the community leaders, educators and mentors supporting girls, teenage mothers and young women in Kakuma, Turkana County, Kenya.`,
    ogImage: '/images/team-hero-og.jpg',
  },
  '/programs/': {
    title: 'Programs',
    description:
      'Our programmes in Kakuma, Kenya: girls’ education and literacy, digital and technical skills, mentorship and life skills, menstrual dignity, SRHR, and livelihoods and economic empowerment.',
  },
  '/impact/': {
    title: 'Impact',
    description:
      `The impact of ${ORG_NAME} on girls, teenage mothers and young women in Kakuma — outcomes, reach and how we measure change.`,
  },
  '/about/our-story/': {
    title: 'Our Story',
    fullTitle: 'Our Story | MaLua Lugazo: Building Hope for Girls in Kakuma',
    description:
      `MaLua Lugazo is a Somali refugee living in Kakuma Refugee Camp who founded ${ORG_NAME} so that every girl and young woman has a chance to learn, grow and lead.`,
  },
  '/updates/': {
    title: 'Community Updates & Stories',
    description:
      `Community updates and stories from ${ORG_NAME} — scholarships, skills training, menstrual dignity, mentorship and livelihoods in Kakuma.`,
  },
  '/impact/blogs/': {
    title: 'Blogs',
    description:
      `Blogs and reflections from ${ORG_NAME} — voices from our team, mentors and the women and girls we work with in Kakuma.`,
    ogImage: '/images/blogs-hero-og.jpg',
  },
  '/impact/report/': {
    title: 'Report',
    description:
      `Reports from ${ORG_NAME} — outcomes, reach and how we measure change across our programmes in Kakuma, Kenya.`,
    ogImage: '/images/report-hero-og.jpg',
  },
  '/impact/post/': {
    title: 'Post',
    description:
      `Posts and updates from ${ORG_NAME} — stories, announcements and highlights from our work in Kakuma, Kenya.`,
    ogImage: '/images/post-hero-og.jpg',
  },
  '/get-involved/': {
    title: 'Get Involved',
    description:
      `Support vulnerable girls, teenage mothers and young women in Kakuma — donate, volunteer, become a member, mentor or partner with ${ORG_NAME}.`,
    ogImage: '/images/get-involved-hero.jpg',
  },
  '/resources/': {
    title: 'Resources',
    description:
      `Reports, toolkits and guides from ${ORG_NAME} on girls’ education, skills, mentorship, health and economic empowerment in Kakuma, Kenya.`,
  },
  '/safeguarding/': {
    title: 'Safeguarding',
    description:
      'Our safeguarding and child protection commitments for girls, teenage mothers and young women in our programmes in Kakuma, Kenya.',
  },
  '/contact/': {
    title: 'Contact & Partner With Us',
    description:
      `Partner with ${ORG_NAME} in Kakuma Refugee Camp, Kenya. Support girls’ education, mentorship, digital skills, menstrual health and economic empowerment.`,
  },
}

// Get Involved sub-pages.
const involvementSeo = {
  donate: {
    title: 'Donate',
    description:
      `Donate to ${ORG_NAME} and fund education, literacy, skills, mentorship, health and economic empowerment for girls and young women in Kakuma, Kenya.`,
    ogImage: '/images/donate-hero-og.jpg',
  },
  volunteer: {
    title: 'Volunteer',
    fullTitle: `Volunteer | ${ORG_NAME}, Kakuma, Kenya`,
    description:
      'Apply to volunteer with Women Without Borders Hub in Kakuma, Kenya. Share your time and skills to support girls and young women through our programmes.',
    ogImage: '/images/volunteer-hero-og.jpg',
  },
  membership: {
    title: 'Membership',
    description:
      `Become a member of ${ORG_NAME} and help shape our work with girls and young women in Kakuma, Kenya.`,
  },
  mentor: {
    title: 'Mentor',
    description:
      'Become a mentor for vulnerable girls, teenage mothers and young women in Kakuma — share your experience through mentorship and life-skills guidance.',
  },
  partner: {
    title: 'Partner',
    description:
      `Partner with ${ORG_NAME} — schools, training institutions, health providers, NGOs, development organizations, donors and private-sector partners in Kakuma, Kenya.`,
  },
}

/**
 * Program SEO details, keyed by slug.
 * Maps to the site's eight main SEO topics; used on program pages
 * and page metadata.
 */
const programSeo = {
  'second-chance-education': {
    title: 'Second Chance Education',
    seoTopic: 'Girls’ Learning Opportunities in Kakuma',
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
    ogImage: '/images/livelihood-hero-og.jpg',
    fullTitle:
      `Livelihood & Economic Empowerment | ${ORG_NAME}, Kakuma, Kenya`,
    seoTopic: 'Livelihoods & Women’s Economic Empowerment',
    seoDescription:
      'Women and young people can develop practical skills, explore income opportunities, strengthen confidence, and work toward greater financial independence.',
  },
}

const livelihoodWhatWeDoSeo = {
  title:
    `What We Do | Livelihood & Economic Empowerment | ${ORG_NAME}`,
  description:
    'Livelihood & Economic Empowerment is one of our core programme areas. We work alongside women and girls to identify barriers and expand access to opportunities.',
}

const livelihoodOurApproachSeo = {
  title:
    `Our Approach | Livelihood & Economic Empowerment | ${ORG_NAME}`,
  description:
    'We aim to develop livelihood initiatives that are practical, inclusive, community-informed, and responsive to the experiences of the people we serve. Kakuma.',
}

const updateSeo = {
  'building-pathways-for-women-and-girls': {
    title: 'Building Pathways for Women and Girls in Kakuma',
    description:
      'Women Without Borders Hub is building pathways for women and girls in Kakuma to learn, earn and lead through education, health advocacy, entrepreneurship and technical skills.',
    ogImage: '/images/og-update-building-pathways.jpg',
  },
  'graduation-celebration-skills': {
    title: 'Young Women Graduate from Tailoring and Digital Skills Training',
    description:
      'Young women complete tailoring and digital skills training, celebrating resilience, growth and new possibilities with Women Without Borders Hub.',
    ogImage: '/images/og-update-graduates.jpg',
  },
  'health-advocacy': {
    title: 'Health Advocacy in Kakuma',
    description:
      'Women Without Borders Hub supports health awareness and community wellbeing in Kakuma through learning, engagement and advocacy.',
    ogImage: '/images/og-update-health.jpg',
  },
}

/**
 * Team member profile pages: "/about/our-team/<slug>/".
 * Each entry carries its own title and description so the profile page
 * is indexable (noindex) only when it is still a placeholder.
 */
const teamProfileSeo = {
  'malua-lugazo': {
    name: 'MaLua Lugazo',
    title: 'MaLua Lugazo - Founder & Executive Director',
    // Official name of the organization for this profile page.
    // Kept as SITE.name so branding and metadata never drift apart.
    orgName: ORG_NAME,
    description:
      `MaLua Lugazo is the Founder and Executive Director of ${ORG_NAME}, a community-led initiative in Kakuma Refugee Camp, Kenya, empowering refugee and marginalized women and girls through education, mentorship, digital skills, health awareness and economic empowerment.`,
  },
}

/**
 * Resolve the SEO metadata for a pathname.
 * Returns { title, description, noindex }.
 */
export function seoFor(pathname, translate) {
  const path =
    pathname === '/' || pathname.endsWith('/') ? pathname : `${pathname}/`

  if (translate) {
    const text = (key, fallback, returnObjects = false) =>
      translate(key, { defaultValue: fallback, returnObjects })
    const stringValue = (key, fallback) => {
      const value = text(key, fallback, true)
      return Array.isArray(value) ? value.join(' ') : value
    }
    const pageMetadata = {
      '/': ['homeHero.titlePrefix', 'homeHero.lead', '/images/og-home.jpg'],
      '/about/': ['about.heading', 'about.paragraph'],
      '/about/our-team/': [
        'about.ourTeam.title',
        'about.ourTeam.intro',
        '/images/team-hero-og.jpg',
      ],
      '/programs/': ['programs.title', 'programs.intro'],
      '/impact/': ['nav.impact', 'impactSection.intro'],
      '/about/our-story/': ['ourStory.pageTitle', 'ourStory.lead'],
      '/updates/': ['updates.title', 'updates.intro'],
      '/impact/blogs/': [
        'blogs.title',
        'impactSectionPages.blogs.intro',
        '/images/blogs-hero-og.jpg',
      ],
      '/impact/report/': [
        'report.title',
        'impactSectionPages.report.intro',
        '/images/report-hero-og.jpg',
      ],
      '/impact/post/': [
        'post.title',
        'impactSectionPages.post.intro',
        '/images/post-hero-og.jpg',
      ],
      '/get-involved/': [
        'getInvolved.title',
        'getInvolved.intro',
        '/images/get-involved-hero.jpg',
      ],
      '/resources/': ['resources.title', 'resources.intro'],
      '/safeguarding/': ['safeguarding.title', 'safeguarding.intro'],
      '/contact/': ['contact.title', 'contact.intro'],
    }

    if (path === '/') {
      const title = [
        text('homeHero.titlePrefix', 'Empowering'),
        text('homeHero.girls', 'girls'),
        text('homeHero.connector', '&'),
        text('homeHero.youngWomen', 'young women'),
        text('homeHero.location', 'in Kakuma, Kenya'),
      ].join(' ')
      return {
        title: `${title} | ${SITE.name}`,
        description: text('homeHero.lead', SITE.description),
        noindex: false,
        ogImage: '/images/og-home.jpg',
      }
    }

    const page = pageMetadata[path]
    if (page) {
      const [titleKey, descriptionKey, ogImage] = page
      return {
        title: `${text(titleKey, pageSeo[path]?.title || SITE.name)} | ${SITE.name}`,
        description: text(
          descriptionKey,
          pageSeo[path]?.description || SITE.shortDescription,
        ),
        noindex: false,
        ogImage: ogImage || pageSeo[path]?.ogImage || null,
      }
    }

    const profileMatch = path.match(/^\/about\/our-team\/([^/]+)\/$/)
    if (profileMatch) {
      const profile = teamProfileSeo[profileMatch[1]]
      return {
        title: profile
          ? `${stringValue('profile.title', profile.title)} | ${SITE.name}`
          : `Profile not found | ${SITE.name}`,
        description: text(
          profile ? 'profile.heroIntro' : 'team.subtitle',
          profile?.description || SITE.shortDescription,
        ),
        noindex: !profile,
      }
    }

    if (path === '/programs/livelihood-economic-empowerment/what-we-do/') {
      return {
        title: `${stringValue('programs.livelihood.whatWeDo.title', livelihoodWhatWeDoSeo.title)} | ${SITE.name}`,
        description: stringValue(
          'programs.livelihood.whatWeDo.intro',
          livelihoodWhatWeDoSeo.description,
        ),
        noindex: false,
        ogImage: '/images/program-livelihood-banner-desktop.jpg',
      }
    }

    if (path === '/programs/livelihood-economic-empowerment/our-approach/') {
      return {
        title: `${stringValue('programs.livelihood.ourApproach.title', livelihoodOurApproachSeo.title)} | ${SITE.name}`,
        description: stringValue(
          'programs.livelihood.ourApproach.intro',
          livelihoodOurApproachSeo.description,
        ),
        noindex: false,
        ogImage: '/images/livelihood-hero-og.jpg',
      }
    }

    const programMatch = path.match(/^\/programs\/([^/]+)\/$/)
    if (programMatch) {
      const slug = programMatch[1]
      const key = `programs.cards.${slug}`
      const program = programSeo[slug]
      if (program) {
        return {
          title: `${text(`${key}.title`, program.title)} | ${SITE.name}`,
          description: text(`${key}.summary`, program.seoDescription),
          noindex: false,
          ogImage: program.ogImage || null,
        }
      }
    }

    const updateMatch = path.match(/^\/updates\/([^/]+)\/$/)
    if (updateMatch) {
      const update = updateSeo[updateMatch[1]]
      if (update) {
        return {
          title: `${text(`updates.items.${updateMatch[1]}.title`, update.title)} | ${SITE.name}`,
          description: text(
            `updates.items.${updateMatch[1]}.summary`,
            update.description,
          ),
          noindex: false,
          ogImage: update.ogImage,
        }
      }
    }

    const involvedMatch = path.match(/^\/get-involved\/([^/]+)\/$/)
    if (involvedMatch) {
      const keys = {
        donate: ['getInvolvedCards.cardDonate.title', 'donate.subtitle'],
        volunteer: ['getInvolvedCards.cardVolunteer.title', 'volunteer.intro'],
        membership: ['footer.membership', 'getInvolved.intro'],
        mentor: ['getInvolvedCards.cardSkills.title', 'getInvolved.intro'],
        partner: ['getInvolvedCards.cardPartner.title', 'getInvolved.intro'],
      }[involvedMatch[1]]
      const page = involvementSeo[involvedMatch[1]]
      if (page && keys) {
        return {
          title: `${text(keys[0], page.title)} | ${SITE.name}`,
          description: text(keys[1], page.description),
          noindex: false,
          ogImage: page.ogImage || null,
        }
      }
    }

    return {
      title: `${text('notFound.title', 'Page not found')} | ${SITE.name}`,
      description: text('notFound.message', SITE.shortDescription),
      noindex: true,
    }
  }

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
      ogImage: pageSeo[path].ogImage || null,
    }
  }

  // Dynamic team profile pages: "/about/our-team/<slug>/".
  // Placeholder pages are noindexed so Google does not index empty pages.
  const profileMatch = path.match(/^\/about\/our-team\/([^/]+)\/$/)
  if (profileMatch) {
    const member = teamProfileSeo[profileMatch[1]]
    if (member) {
      return {
        title: `${member.title || member.name} | ${member.orgName || SITE.name}`,
        description: member.description || SITE.shortDescription,
        siteName: member.orgName || SITE.name,
        noindex: false,
      }
    }
    return {
      title: `Profile not found | ${SITE.name}`,
      description: SITE.shortDescription,
      noindex: true,
    }
  }

  // Dynamic program pages: "/programs/<slug>/".
  if (
    path ===
    '/programs/livelihood-economic-empowerment/what-we-do/'
  ) {
    return {
      ...livelihoodWhatWeDoSeo,
      noindex: false,
      ogImage: '/images/program-livelihood-banner-desktop.jpg',
    }
  }

  if (path === '/programs/livelihood-economic-empowerment/our-approach/') {
    return {
      ...livelihoodOurApproachSeo,
      noindex: false,
      ogImage: '/images/livelihood-hero-og.jpg',
    }
  }

  const updateMatch = path.match(/^\/updates\/([^/]+)\/$/)
  if (updateMatch) {
    const update = updateSeo[updateMatch[1]]
    if (update) {
      return {
        title: `${update.title} | ${SITE.name}`,
        description: update.description,
        noindex: false,
        ogImage: update.ogImage,
      }
    }
    return {
      title: `Update not found | ${SITE.name}`,
      description: SITE.shortDescription,
      noindex: true,
    }
  }

  const programMatch = path.match(/^\/programs\/([^/]+)\/$/)
  if (programMatch) {
    const program = programSeo[programMatch[1]]
    if (program) {
      return {
        title:
          program.fullTitle ||
          `${program.title} | ${SITE.name} — ${program.seoTopic}`,
        description: program.seoDescription,
        noindex: false,
        ogImage: program.ogImage || null,
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
        title: item.fullTitle || `${item.title} | ${SITE.name}`,
        description: item.description,
        noindex: false,
        ogImage: involvedMatch[1] === 'volunteer' ? item.ogImage || null : null,
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
/**
 * Person structured data for the MaLua Lugazo profile page.
 * The organization name is kept identical to the site name
 * ("Women Without Borders Hub") so the data stays consistent.
 */
export function maluaLugazoPersonSchema() {
  // The organization name is kept identical to the site name
  // (SITE.name) so the structured data stays consistent with the brand.
  const orgName = SITE.name
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'MaLua Lugazo',
    jobTitle: 'Founder and Executive Director',
    description:
      `MaLua Lugazo is the Founder and Executive Director of ${ORG_NAME}, a community-led initiative in Kakuma Refugee Camp, Kenya, with over nine years of experience in humanitarian and community development.`,
    worksFor: {
      '@type': 'Organization',
      name: orgName,
      description: SITE.shortDescription,
    },
    jobLocation: {
      '@type': 'Place',
      name: SITE.location,
    },
    knowsAbout: [
      'Community development',
      'Education in emergencies',
      'Mentorship',
      'Digital skills',
      'Health awareness',
      'Women’s economic empowerment',
    ],
  }

  if (SITE.url) {
    schema.url = new URL('/about/our-team/malua-lugazo/', SITE.url).toString()
    schema.worksFor.url = SITE.url
  }
  if (SITE.logo) schema.image = SITE.logo

  return schema
}

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

/**
 * Contact page structured data.
 *
 * ContactPage for the page itself, plus an Organization (typed as NGO) for
 * the organisation and a BreadcrumbList (Home > Contact). Values that are
 * not officially configured (domain, logo, email) fall back to real,
 * existing site assets rather than inventing data.
 */
export function contactOrganizationSchema() {
  const contactUrl = SITE.url
    ? new URL('/contact/', SITE.url).toString()
    : '/contact/';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    additionalType: 'NGO',
    name: SITE.name,
    description:
      `${ORG_NAME} is a community-based organization in Kakuma Refugee Camp, Kenya. We empower girls and young women in refugee and host communities through education, literacy, mentorship, digital and practical skills, menstrual health education, sexual and reproductive health awareness, and economic empowerment.`,
    email: 'womenwithoutbordershub@gmail.com',
    logo: '/women-hub-logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.streetAddress,
      addressLocality: 'Kakuma',
      addressRegion: SITE.address.addressRegion,
      addressCountry: 'KE',
    },
    areaServed: 'Kakuma Refugee Camp, Kenya',
    knowsAbout: [
      "girls' education",
      'literacy',
      'mentorship',
      'digital skills',
      'menstrual health education',
      'sexual and reproductive health',
      'economic empowerment',
    ],
  };

  if (SITE.url) schema.url = contactUrl;

  return schema
}

export function contactPageSchema() {
  const contactUrl = SITE.url
    ? new URL('/contact/', SITE.url).toString()
    : '/contact/';

  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: contactUrl,
    name: `Contact & Partner With Us | ${ORG_NAME}`,
    description:
      `Partner with ${ORG_NAME} in Kakuma Refugee Camp, Kenya. Support girls’ education, mentorship, digital skills, menstrual health and economic empowerment.`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE.name,
      url: contactUrl,
    },
  };
}

export function breadcrumbListSchema(pathname, labels, translate) {
  const path = normalizePath(pathname);
  const trail = breadcrumbsFor(path)

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: labels?.[index] || translate?.(crumb.labelKey) || crumb.labelKey,
      item: SITE.url ? new URL(crumb.to, SITE.url).toString() : crumb.to,
    })),
  };
}
