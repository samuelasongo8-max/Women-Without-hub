import { involvement, programs } from '../data/site.js'
import { SITE } from '../data/seo.js'
import { updates } from '../sections/CommunityUpdates.jsx'

export function buildSearchIndex(t) {
  const records = []
  const involvedCardKeys = ['cardDonate', 'cardPartner', 'cardVolunteer', 'cardSkills']
  const add = (id, title, heading, text, url) => {
    if (text) records.push({ id, title, heading, text, url })
  }

  const homeTitle = t('nav.home', { defaultValue: 'Home' })
  const aboutTitle = t('nav.about', { defaultValue: 'About' })
  const programsTitle = t('nav.programs', { defaultValue: 'Programs' })
  const involvedTitle = t('nav.getInvolved', { defaultValue: 'Get Involved' })
  const impactTitle = t('nav.impact', { defaultValue: 'Impact' })
  const contactTitle = t('nav.contact', { defaultValue: 'Contact' })

  add(
    'home-intro',
    homeTitle,
    t('homePage.title', { defaultValue: 'Women Without Borders Hub' }),
    t('homePage.intro', { defaultValue: '' }),
    '/',
  )
  add(
    'home-hero',
    homeTitle,
    'Empowering girls and young women in Kakuma',
    'Creating opportunities for vulnerable girls, teenage mothers and young women through education, skills, mentorship, health and economic empowerment in Kakuma, Kenya.',
    '/',
  )
  add(
    'why-this-matters',
    homeTitle,
    t('common.whyThisMatters', { defaultValue: 'Why this matters' }),
    t('common.whyIntro', { defaultValue: '' }),
    '/#why-this-matters',
  )
  add(
    'home-impact',
    homeTitle,
    t('impactSection.title', { defaultValue: 'Our Impact' }),
    t('impactSection.intro', {
      defaultValue:
        'Measured outcomes across our programmes with refugee and host communities in Kakuma.',
    }),
    '/#our-impact',
  )
  add(
    'home-partners',
    homeTitle,
    'Our Partners',
    'Teach for Community',
    '/#ourpartners-heading',
  )
  add(
    'home-testimonial',
    homeTitle,
    t('quoteFeature.name', { defaultValue: 'Community voices' }),
    t('quoteFeature.quote', { defaultValue: '' }),
    '/',
  )
  add(
    'founder-story',
    homeTitle,
    t('quoteSection.name', { defaultValue: 'Our Founder' }),
    t('quoteSection.quote2', {
      defaultValue:
        'I founded Women Without Borders Hub because I believe that every girl and young woman deserves a chance to create a better future, regardless of the challenges she faces. Too many talented young women have dreams that remain out of reach because of financial hardship, limited opportunities, and barriers that hold them back. I want to help change that by creating opportunities for learning, empowerment, and personal growth, where every girl can discover her strengths, find her voice, and move forward with confidence.',
    }),
    '/',
  )

  add(
    'about-overview',
    aboutTitle,
    t('about.heading', { defaultValue: 'About' }),
    t('about.paragraph', { defaultValue: '' }),
    '/about/',
  )
  add(
    'about-partners',
    aboutTitle,
    t('about.whereWeWork', { defaultValue: 'Where we work' }),
    t('about.partnersText', { defaultValue: '' }),
    '/about/',
  )
  add(
    'about-mission',
    aboutTitle,
    t('about.missionTitle', { defaultValue: 'Our mission' }),
    SITE.mission,
    '/about/',
  )
  add(
    'about-vision',
    aboutTitle,
    t('about.visionTitle', { defaultValue: 'Our vision' }),
    SITE.vision,
    '/about/',
  )
  add(
    'about-team',
    aboutTitle,
    t('about.ourTeam.title', { defaultValue: 'Our Team' }),
    t('about.ourTeam.intro', { defaultValue: '' }),
    '/about/our-team/',
  )
  add(
    'our-story',
    t('nav.ourStory', { defaultValue: 'Our Story' }),
    'MaLua Lugazo: Building Hope for Girls in Kakuma',
    'MaLua Lugazo is a Somali refugee living in Kakuma Refugee Camp who founded Women Without Borders Hub so that every girl and young woman has a chance to learn, grow and lead. MaLua Lugazo knows Kakuma from the inside. As a Somali refugee growing up in the camp, she watched bright girls disappear from classrooms - early marriage, pregnancy, household labour and school costs closing doors one by one. She also saw what a single opportunity could do: a scholarship, a mentor, a safe room to study in. That contrast - between what girls in Kakuma are denied and what they become when someone believes in them - is where Women Without Borders Hub began.',
    '/about/our-story/',
  )
  add(
    'programs-overview',
    programsTitle,
    t('programs.title', { defaultValue: 'Programs' }),
    t('programs.intro', { defaultValue: '' }),
    '/programs/',
  )

  programs.forEach((program) => {
    add(
      `program-${program.slug}`,
      programsTitle,
      program.title,
      program.summary,
      `/programs/${program.slug}/`,
    )
  })

  const livelihoodIntro = t('programs.livelihood.whatWeDo.intro', {
    returnObjects: true,
    defaultValue: [],
  })
  const livelihoodAreas = t('programs.livelihood.whatWeDo.areas', {
    returnObjects: true,
    defaultValue: [],
  })
  const livelihoodWhatWeDoText = [
    ...(Array.isArray(livelihoodIntro) ? livelihoodIntro : []),
    ...(Array.isArray(livelihoodAreas)
      ? livelihoodAreas.flatMap((area) => [area.title, ...area.paragraphs])
      : []),
  ].join(' ')
  add(
    'program-livelihood-what-we-do',
    programsTitle,
    t('programs.livelihood.whatWeDo.title', { defaultValue: 'What We Do' }),
    livelihoodWhatWeDoText,
    '/programs/livelihood-economic-empowerment/what-we-do/',
  )

  add(
    'get-involved-overview',
    involvedTitle,
    t('getInvolvedCards.heading', { defaultValue: 'Ways to support women and girls' }),
    t('getInvolvedCards.intro', { defaultValue: '' }),
    '/get-involved/',
  )
  involvement.forEach((option) => {
    add(
      `involvement-${option.slug}`,
      involvedTitle,
      option.title,
      option.summary,
      `/get-involved/${option.slug}/`,
    )
  })
  involvedCardKeys.forEach((key) => {
    add(
      `get-involved-${key}`,
      involvedTitle,
      t(`getInvolvedCards.${key}.title`, { defaultValue: '' }),
      t(`getInvolvedCards.${key}.text`, { defaultValue: '' }),
      '/get-involved/',
    )
  })

  add(
    'impact-overview',
    impactTitle,
    t('impact.title', { defaultValue: 'Impact' }),
    t('impact.subtitle', {
      defaultValue: 'We measure what matters and publish it. Here is what your support has achieved.',
    }),
    '/impact/',
  )
  add(
    'how-we-measure',
    impactTitle,
    t('impact.measureTitle', { defaultValue: 'How we measure' }),
    t('impact.measureText', {
      defaultValue:
        'Every programme tracks participation, completion and outcome indicators, verified through follow-up surveys at 3, 6 and 12 months. Annual reports are published in Resources.',
    }),
    '/impact/',
  )
  add(
    'contact-overview',
    contactTitle,
    t('contact.title', { defaultValue: 'Contact' }),
    t('contact.intro', { defaultValue: '' }),
    '/contact/',
  )
  add(
    'contact-partnership',
    contactTitle,
    t('contact.partnerHeading', { defaultValue: 'Partner With Women Without Borders Hub' }),
    t('contact.partnerText1', { defaultValue: '' }),
    '/contact/',
  )
  add(
    'news',
    t('nav.news', { defaultValue: 'News' }),
    t('news.title', { defaultValue: 'News' }),
    t('news.intro', { defaultValue: '' }),
    '/impact/news/',
  )
  add(
    'blogs',
    t('nav.blogs', { defaultValue: 'Blogs' }),
    t('impactSectionPages.blogs.intro', { defaultValue: '' }),
    t('impactSectionPages.blogs.intro', { defaultValue: '' }),
    '/impact/blogs/',
  )
  add(
    'reports',
    t('nav.report', { defaultValue: 'Reports' }),
    t('impactSectionPages.report.intro', { defaultValue: '' }),
    t('impactSectionPages.report.intro', { defaultValue: '' }),
    '/impact/report/',
  )
  add(
    'updates-overview',
    t('updates.title', { defaultValue: 'Community Updates & Stories' }),
    t('updates.title', { defaultValue: 'Community Updates & Stories' }),
    t('updates.intro', { defaultValue: '' }),
    '/updates/',
  )
  add(
    'resources',
    t('nav.resources', { defaultValue: 'Resources' }),
    t('resources.title', { defaultValue: 'Resources' }),
    t('resources.intro', { defaultValue: '' }),
    '/resources/',
  )
  add(
    'safeguarding',
    t('nav.safeguarding', { defaultValue: 'Safeguarding' }),
    t('safeguarding.title', { defaultValue: 'Safeguarding' }),
    t('safeguarding.intro', { defaultValue: '' }),
    '/safeguarding/',
  )
  updates.forEach((update) => {
    add(
      `update-${update.slug}`,
      t('updates.title', { defaultValue: 'Community Updates & Stories' }),
      update.title,
      update.fullText,
      update.to,
    )
  })

  return records
}
