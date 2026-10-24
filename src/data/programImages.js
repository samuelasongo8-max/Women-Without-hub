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
  'education-literacy': {
    slug: 'education-literacy',
    image: '/images/literacy-education.jpg',
    alt: 'Girls learning literacy in a classroom in Kakuma',
    objectPosition: 'center',
  },
  'digital-technical-skills': {
    slug: 'digital-technical-skills',
    image: '/images/digital-technical-skills.jpg',
    alt: 'Young women learning digital and technical skills in Kakuma',
    objectPosition: 'center',
  },
  'mentorship-life-skills': {
    slug: 'mentorship-life-skills',
    image: '/images/women-hub-training.png',
    alt: 'Young women in a training and mentorship session in Kakuma',
    objectPosition: 'center',
  },
  'health-menstrual-dignity': {
    slug: 'health-menstrual-dignity',
    image: '/images/avocating-health.jpg',
    alt: 'Health and menstrual dignity advocacy in Kakuma',
    objectPosition: 'center',
  },
  srhr: {
    slug: 'srhr',
    image: '/images/srhr.jpg',
    alt: 'Young women in an SRHR education and peer support session in Kakuma',
    objectPosition: 'center',
  },
  'livelihood-economic-empowerment': {
    slug: 'livelihood-economic-empowerment',
    image: '/images/graduation-at-women-without-border.jpg',
    alt: 'Women graduating from a livelihood and economic empowerment programme in Kakuma',
    objectPosition: 'center',
  },
}

export default programImages
