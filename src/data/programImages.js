/**
 * Centralised image mapping for the six programme cards.
 *
 * Each entry maps a programme slug to the photo shown on its card
 * (home page "Our Programs" section and /programs listing).
 *
 * ── How to replace an image later ──────────────────────────────────────
 * 1. Drop the new photo into the `public/` folder (do NOT rename/move
 *    existing files).
 * 2. Update the `image` path below for the relevant slug.
 * 3. Recommended specs: landscape, ~1200×800 px, under 300 KB, jpg or webp.
 * 4. Adjust `objectPosition` if the subject is off-centre.
 * ────────────────────────────────────────────────────────────────────────
 */
export const programImages = {
  'second-chance-education': {
    slug: 'second-chance-education',
    image: '/images/second-chance-education-study.jpg',
    altKey: 'programs.cards.second-chance-education.imageAlt',
    objectPosition: 'center',
  },
  'digital-technical-skills': {
    slug: 'digital-technical-skills',
    image: '/images/digital-technical-skills.jpg',
    altKey: 'programs.cards.digital-technical-skills.imageAlt',
    objectPosition: 'center',
  },
  'mentorship-life-skills': {
    slug: 'mentorship-life-skills',
    image: '/images/women-hub-training.png',
    altKey: 'programs.cards.mentorship-life-skills.imageAlt',
    objectPosition: 'center',
  },
  'health-menstrual-dignity': {
    slug: 'health-menstrual-dignity',
    image: '/images/avocating-health.jpg',
    altKey: 'programs.cards.health-menstrual-dignity.imageAlt',
    objectPosition: 'center',
  },
  srhr: {
    slug: 'srhr',
    image: '/images/srhr.jpg',
    altKey: 'programs.cards.srhr.imageAlt',
    objectPosition: 'center',
  },
  'livelihood-economic-empowerment': {
    slug: 'livelihood-economic-empowerment',
    image: '/images/graduation-at-women-without-border.jpg',
    altKey: 'programs.cards.livelihood-economic-empowerment.imageAlt',
    objectPosition: 'center',
  },
}

export default programImages
