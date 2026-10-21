import { organizationSchema } from '../data/seo.js'
import Hero from '../sections/Hero.jsx'
import WhoWeAre from '../sections/WhoWeAre.jsx'
import CommunityUpdates from '../sections/CommunityUpdates.jsx'
import Programs from '../sections/Programs.jsx'
import ImageBand from '../components/ImageBand.jsx'
import WhyThisMatters from '../sections/WhyThisMatters.jsx'
import QuoteFeature from '../sections/QuoteFeature.jsx'
import Impact from '../sections/Impact.jsx'
import Stories from '../sections/Stories.jsx'
import GetInvolved from '../sections/GetInvolved.jsx'
import OurPartners from '../sections/OurPartners.jsx'
import Donate from '../sections/Donate.jsx'

/**
 * Image used by the slim decorative band on the home page.
 *
 * The band sits directly between the "Community Updates & Stories"
 * section and the "Our Programs" section.
 *
 * ── How to replace this image later ───────────────────────────────────────
 * 1. Drop the new photo into the `public/` folder (do NOT rename/move
 *    existing files).
 * 2. Change the ONE path below. Spaces must be URL-encoded (%20).
 * 3. Landscape works best for a wide band (e.g. 1600×1200 or wider).
 * ───────────────────────────────────────────────────────────────────────────
 */
const IMAGE_BAND_IMAGE = '/our%20program%20at%20women%20Withou%20hub.jpg'

/**
 * Message shown over the home-page image band (the band that sits
 * directly above the "Our Programs" section).
 * The band height is unchanged — the text is an overlay inside it.
 */
const IMAGE_BAND_TEXT =
  'Discover how Women Without Borders Hub empowers girls and young women in Kakuma Refugee Camp through education, mentorship, health awareness, skills development, and economic opportunities. Together, we are building confidence, dignity, and a brighter future for our community.'

/**
 * Home page — composed of independent sections, each with its own
 * component and CSS file in src/sections/:
 *
 *   Hero → Our Story → Who We Are → Community Updates → Our Programs →
 *   Image Band → Why This Matters → Quote Feature → Impact → Stories →
 *   Get Involved → Our Partners → Donate
 */
export default function Home() {
  return (
    <>
      {/* Organization structured data — homepage only, per Google guidance. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />

      <Hero />
      <WhoWeAre />
      <CommunityUpdates />
      {/* Slim decorative image band — sits directly between
          "Community Updates & Stories" and "Our Programs".
          The message is overlaid on the photo; the band keeps its
          original height. */}
      <ImageBand image={IMAGE_BAND_IMAGE} overlayText={IMAGE_BAND_TEXT} />
      <Programs />
      <WhyThisMatters />
      <QuoteFeature
        quote="Every girl and young woman deserves a safe space to learn, grow, and believe in herself. When we support one another, share knowledge, and build our confidence, we create opportunities for a brighter future for ourselves and our community."
        name="Khadijoh Mahamed"
        role="Member of Women Without Borders Hub"
        image="/Khadijoh%20Mahamed.jpg"
        alt="Khadijoh Mahamed"
      />
      <Impact />
      <Stories />
      <GetInvolved />
      <OurPartners />
      <Donate />
    </>
  )
}

