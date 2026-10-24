import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { SITE } from '../data/seo.js'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import './About.css'

/**
 * About page — who we are, mission & vision, who we serve, core values,
 * where we work and ways to support. Every visible string uses t() with an
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
                'Women Without Borders Hub is a community-led organization in Kakuma, Turkana County, Kenya, creating opportunities for vulnerable girls, teenage mothers and young women.',
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

      {/* Ways to support — four action cards */}
      <section className="about-actions" aria-label="Ways to support">
        <h2 className="section-title">
          {t('about.actionsHeading', { defaultValue: 'Ways to support' })}
        </h2>
        <div className="card-grid">
          <article className="about-card">
            <div className="about-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-6c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h3>{t('about.card1Label', { defaultValue: "Sponsor a Girl's Education" })}</h3>
            <p>{t('about.card1Desc', { defaultValue: "Help fund a girl's education journey" })}</p>
            <Link to="/get-involved/" className="about-card__link">{t('common.learnMore')}</Link>
          </article>
          <article className="about-card">
            <div className="about-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2c-4 0-8 4-8 8 0 4.3 3.3 8 7.6 8.2 0.5 0 0.8 0.5 0.8 0.9s0 0.4-0.1 0.6c-0.2 0.4-0.6 0.7-1.1 0.7h-2c-0.5 0-0.9-0.4-0.9-0.9v-6c0-0.5 0.4-0.9 0.9-0.9h2c0.5 0 0.9 0.4 0.9 0.9v0.1l0 0.1c0.4 0.2 0.7 0.6 0.7 1.1 0 0.4-0.3 0.8-0.8 0.9-0.5 0.1-0.8 0.1-0.8 0.1v3c0 0.5-0.4 0.9-0.9 0.9h-1c-0.5 0-0.9-0.4-0.9-0.9v-3c0-0.5 0.4-0.9 0.9-0.9h1c0.5 0 0.9 0.4 0.9 0.9v0c0 0.5-0.4 0.9-0.9 0.9h-0.1c-0.5 0-0.8-0.2-1-0.6-0.6-1-0.9-2.2-0.9-3.4C4 6.6 7.4 3 12 3s8 3.6 8 8c0 4-4 7-7.8 7.8-0.2 0-0.5 0-0.7-0.2-0.4-0.4-0.4-1 0-1.4C15.3 8.6 13.8 5 12 2z" />
              </svg>
            </div>
            <h3>{t('about.card2Label', { defaultValue: 'Support Menstrual Health Education' })}</h3>
            <p>{t('about.card2Desc', { defaultValue: 'Provide menstrual health resources' })}</p>
            <Link to="/get-involved/" className="about-card__link">{t('common.learnMore')}</Link>
          </article>
          <article className="about-card">
            <div className="about-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20 18c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2H4c-1.1 0-2 0.9-2 2v10c0 1.1 0.9 2 2 2zm0-12V6h16v10c0 1.1-0.9 2-2 2h-3c-0.6 0-1-0.4-1-1s0.4-1 1-1h3c0.6 0 1 0.4 1 1v1c0 1.1-0.9 2-2 2H4c-1.1 0-2-0.9-2-2V6c0-1.1 0.9-2 2-2h16z" />
              </svg>
            </div>
            <h3>{t('about.card3Label', { defaultValue: 'Fund Digital and Practical Skills' })}</h3>
            <p>{t('about.card3Desc', { defaultValue: 'Support digital skills training' })}</p>
            <Link to="/get-involved/" className="about-card__link">{t('common.learnMore')}</Link>
          </article>
          <article className="about-card">
            <div className="about-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2c0-2.8-2.2-5-5-5h-3.5c-1.5 0-2.9-0.7-3.8-1.8-0.2-0.2-0.5-0.3-0.7-0.1s-0.3 0.5-0.1 0.7c0.9 1.2 2.3 2 3.8 2h3.5c2.8 0 5-2.2 5-5v-2c0-1.1-0.9-2-2-2h-1v-2c0-2.2-1.8-4-4-4s-4 1.8-4 4v2h-1c-1.1 0-2 0.9-2 2v2c0 2.8 2.2 5 5 5h3.5c1.5 0 2.9 0.7 3.8 1.8 0.2 0.2 0.5 0.3 0.7 0.1s0.3-0.5 0.1-0.7c-0.9-1.2-2.3-2-3.8-2h-3.5c-2.8 0-5-2.2-5-5v-2c0-1.1-0.9-2-2-2h-1v-2c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c1.1 0 2 0.9 2 2z" />
              </svg>
            </div>
            <h3>{t('about.card4Label', { defaultValue: 'Partner With Us' })}</h3>
            <p>{t('about.card4Desc', { defaultValue: 'Collaborate with us to empower more girls' })}</p>
            <Link to="/contact/" className="about-card__link">{t('common.learnMore')}</Link>
          </article>
        </div>
      </section>
    </>
  )
}
