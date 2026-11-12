import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
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
    <div className="about-page">
      {/* Hero banner — background image is set in src/site.css */}
      <section className="auvd-about-banner about-hero" aria-labelledby="about-title">
        <div className="auvd-about-overlay" aria-hidden="true" />
        <div className="container auvd-about-content">
          <Breadcrumbs />
          <Reveal
            as="h1"
            id="about-title"
            className="auvd-about-title"
            direction="up"
            duration={800}
            playOnMount
          >
            {t('about.heading', { defaultValue: 'About' })}
          </Reveal>
          <Reveal
            as="p"
            className="auvd-about-text"
            direction="up"
            duration={800}
            delay={200}
            playOnMount
          >
            {t('about.paragraph')}
          </Reveal>
        </div>
      </section>

      <section className="section container about-mission-section">
        <div className="about-feature">
          <Reveal
            as="img"
            className="about-feature-image"
            src="/images/Mission1.jpg"
            alt="Women participating in a community health activity"
            direction="scale"
            duration={1200}
            threshold={0.2}
          />
          <div className="about-feature-card-position">
            <Reveal
              as="div"
              className="auvd-about-mission-box about-feature-card"
              direction="right"
              duration={800}
              delay={200}
              threshold={0.2}
            >
              <h2 className="auvd-about-mission-title">
                {t('about.missionTitle', { defaultValue: 'Our mission' })}
              </h2>
              <p className="auvd-about-mission-text">{t('about.missionText')}</p>
            </Reveal>
          </div>
        </div>

        <div className="about-feature about-feature--reverse">
          <picture className="about-feature-image-frame">
            <Reveal
              as="img"
              className="about-feature-image"
              src="/Our%20Impact%20At%20women%20Without%20border.jpg"
              alt="Community members participating in a Women Without Borders programme"
              width="838"
              height="1877"
              loading="lazy"
              direction="scale"
              duration={1200}
              threshold={0.2}
            />
          </picture>
          <div className="about-feature-card-position">
            <Reveal
              as="div"
              className="auvd-about-vision-box about-feature-card"
              direction="left"
              duration={800}
              delay={200}
              threshold={0.2}
            >
              <h2 className="auvd-about-vision-title">
                {t('about.visionTitle', { defaultValue: 'Our vision' })}
              </h2>
              <p className="auvd-about-vision-text vision-statement">
                {t('about.visionText')}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="about-info"
        aria-label={t('about.detailsLabel', { defaultValue: 'About details' })}
      >
        <div className="about-info-column">
          <div className="about-info-row">
            <Reveal as="h2" className="about-info-heading" direction="up" duration={800} threshold={0.2}>
              {t('about.whoWeServe', { defaultValue: 'Who we serve' })}
            </Reveal>
            <ul className="about-info-serve">
              {t('about.audiences', { returnObjects: true }).map((a, i) => (
                <Reveal as="li" key={a} direction="up" delay={i * 120} threshold={0.2}>{a}</Reveal>
              ))}
              {t('about.communities', { returnObjects: true }).map((c, i) => (
                <Reveal as="li" key={c} direction="up" delay={(i + 2) * 120} threshold={0.2}>{c}</Reveal>
              ))}
            </ul>
          </div>
          <div className="about-info-row">
            <Reveal as="h2" className="about-info-heading" direction="up" duration={800} threshold={0.2}>
              {t('about.coreValues', { defaultValue: 'Our core values' })}
            </Reveal>
            <ul className="about-info-values">
              {t('about.coreValuesItems', { returnObjects: true }).map((v, i) => (
                <Reveal as="li" key={v} direction="up" delay={i * 120} threshold={0.2}>{v}</Reveal>
              ))}
            </ul>
          </div>
          <div className="about-info-row">
            <Reveal as="h2" className="about-info-heading" direction="up" duration={800} threshold={0.2}>
              {t('about.getToKnowUs', { defaultValue: 'Get to know us better' })}
            </Reveal>
            <Reveal as="p" className="about-info-more" direction="up" delay={120} threshold={0.2}>
              {t('about.exploreText', {
                defaultValue: 'Explore our programs, read our impact or get involved.',
              })}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
