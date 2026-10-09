import { organizationSchema } from '../data/seo.js'
import Hero from '../sections/Hero.jsx'
import WhoWeAre from '../sections/WhoWeAre.jsx'
import CommunityUpdates from '../sections/CommunityUpdates.jsx'
import Programs from '../sections/Programs.jsx'
import WhyThisMatters from '../sections/WhyThisMatters.jsx'
import Impact from '../sections/Impact.jsx'
import Stories from '../sections/Stories.jsx'
import GetInvolved from '../sections/GetInvolved.jsx'
import OurPartners from '../sections/OurPartners.jsx'
import Donate from '../sections/Donate.jsx'

/**
 * Home page — composed of independent sections, each with its own
 * component and CSS file in src/sections/:
 *
 *   Hero → Our Story → Who We Are → Community Updates → Our Programs →
 *   Why This Matters → Impact → Stories → Get Involved → Our Partners → Donate
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
      <Programs />
      <WhyThisMatters />
      <Impact />
      <Stories />
      <GetInvolved />
      <OurPartners />
      <Donate />
    </>
  )
}

