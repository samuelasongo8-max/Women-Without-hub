import { organizationSchema } from '../data/seo.js'
import { ORG_NAME } from '../config/site.js'
import { useTranslation } from 'react-i18next'
import HeroRotator from '../sections/HeroRotator.jsx'
import WhoWeAre from '../sections/WhoWeAre.jsx'
import CommunityUpdates from '../sections/CommunityUpdates.jsx'
import Programs from '../sections/Programs.jsx'
import ImageBand from '../components/ImageBand.jsx'
import WhyThisMatters from '../sections/WhyThisMatters.jsx'
import QuoteFeature from '../sections/QuoteFeature.jsx'
import Impact from '../sections/Impact.jsx'
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
const IMAGE_BAND_IMAGE = '/images/our-program-at-women-without-hub.jpg'

/**
 * Home page — composed of independent sections, each with its own
 * component and CSS file in src/sections/:
 *
 *   Hero → Our Story → Who We Are → Community Updates → Our Programs →
 *   Image Band → Why This Matters → Quote Feature → Impact →
 *   Get Involved → Our Partners → Donate
 */
export default function Home() {
  const { t } = useTranslation()
  return (
    <>
      {/* Organization structured data — homepage only, per Google guidance. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />

      <HeroRotator />
      <WhoWeAre />
      <CommunityUpdates />
      {/* Slim decorative image band — sits directly between
          "Community Updates & Stories" and "Our Programs".
          The message is overlaid on the photo; the band keeps its
          original height. */}
      <ImageBand
        image={IMAGE_BAND_IMAGE}
        alt={t('homeHero.imageBandAlt')}
        overlayText={t('homePage.intro', { defaultValue: `${ORG_NAME} — empowering girls and young women in Kakuma Refugee Camp, Kenya.` })}
      />
      <Programs />
      <WhyThisMatters />
      <QuoteFeature
        quote={t('quoteFeature.quote', { defaultValue: "Every girl and young woman deserves a safe space to learn, grow, and believe in herself. When we support one another, share knowledge, and build our confidence, we create opportunities for a brighter future for ourselves and our community." })}
        name={t('quoteFeature.name', { defaultValue: "Khadijoh Mahamed" })}
        role={t('quoteFeature.role', { defaultValue: `Member of ${ORG_NAME}` })}
        image="/Khadijoh%20Mahamed.jpg"
        alt={t('quoteFeature.name', { defaultValue: 'Khadijoh Mahamed' })}
      />
      <QuoteFeature
        quote={t('quoteSection.quote2', { defaultValue: `I founded ${ORG_NAME} because I believe that every girl and young woman deserves a chance to create a better future, regardless of the challenges she faces. Too many talented young women have dreams that remain out of reach because of financial hardship, limited opportunities, and barriers that hold them back. I want to help change that by creating opportunities for learning, empowerment, and personal growth, where every girl can discover her strengths, find her voice, and move forward with confidence.` })}
        name={`Maluo Lugazo - founder of ${ORG_NAME}`}
        role={`Founder of ${ORG_NAME}`}
        image="/images/malua-lugazo.jpg"
        alt={`MaLua Lugazo, Founder of ${ORG_NAME}`}
      />
      <Impact />
      <GetInvolved />
      <OurPartners />
      <Donate />
    </>
  )
}
