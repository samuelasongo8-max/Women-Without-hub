import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { ORG_NAME } from '../config/site.js'
import { SITE } from '../data/seo.js'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import './About.css'

/**
 * About page — who we are, mission & vision, who we serve, and core values.
 * Every visible string uses t() with an
 * English defaultValue so nothing renders empty before a locale is complete.
 */
export default function About() {
  const { t } = useTranslation()
  useHeroImagePreload({
    desktop: '/images/about-banner-desktop.webp',
    mobile: '/images/about-banner-mobile.webp',
  })

  return (
    <>
      {/* Hero banner — background image is set in src/site.css */}
      <section className="auvd-about-banner about-hero" aria-labelledby="about-title">
        <div className="auvd-about-overlay" aria-hidden="true" />
        <div className="container auvd-about-content">
          <Breadcrumbs />
          <h1 id="about-title" className="auvd-about-title">
            {t('about.heading', { defaultValue: 'About' })}
          </h1>
          <p className="auvd-about-text">
            {t('about.paragraph', {
              defaultValue:
                `${ORG_NAME} is a community-led organization in Kakuma, Turkana County, Kenya, creating opportunities for vulnerable girls, teenage mothers and young women.`,
            })}
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="auvd-about-mv-row">
          <div className="auvd-about-mission-box">
            <span className="auvd-quote-mark" aria-hidden="true">&ldquo;</span>
            <h2 className="auvd-about-mission-title">
              {t('about.missionTitle', { defaultValue: 'Our mission' })}
            </h2>
            <p className="auvd-about-mission-text">{SITE.mission}</p>
          </div>
          <div className="auvd-about-vision-box">
            <span className="auvd-quote-mark" aria-hidden="true">&ldquo;</span>
            <h2 className="auvd-about-vision-title">
              {t('about.visionTitle', { defaultValue: 'Our vision' })}
            </h2>
            <p className="auvd-about-vision-text vision-statement">
              {SITE.vision}
            </p>
          </div>
        </div>
      </section>

      <section className="about-info" aria-label="About details">
        <div className="about-info-column">
          <div className="about-info-row">
            <h2 className="about-info-heading">
              {t('about.whoWeServe', { defaultValue: 'Who we serve' })}
            </h2>
            <ul className="about-info-serve">
              {SITE.primaryAudiences.map((a) => <li key={a}>{a}</li>)}
              {SITE.communities.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <div className="about-info-row">
            <h2 className="about-info-heading">
              {t('about.coreValues', { defaultValue: 'Our core values' })}
            </h2>
            <ul className="about-info-values">
              {SITE.values.map((v) => <li key={v}>{v}</li>)}
            </ul>
          </div>
          <div className="about-info-row">
            <h2 className="about-info-heading">
              {t('about.getToKnowUs', { defaultValue: 'Get to know us better' })}
            </h2>
            <p className="about-info-more">
              {t('about.exploreText', {
                defaultValue: 'Explore our programs, read our impact or get involved.',
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
