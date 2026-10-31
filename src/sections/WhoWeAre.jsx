import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { SITE } from '../data/seo.js'
import './WhoWeAre.css'

export default function WhoWeAre() {
  const { t } = useTranslation()

  return (
    <section className="who-we-are">
      <div className="container who-grid">
        <div className="who-art">
          <div className="who-photo-wrap" aria-hidden="true">
            <span className="who-stroke who-stroke--1" />
            <span className="who-stroke who-stroke--2" />
            <span className="who-stroke who-stroke--3" />
            <span className="who-stroke who-stroke--4" />
            <img
              className="who-photo"
              src="/images/literacy-program-at-women-without-hub.jpg"
              alt={t('about.literacyImageAlt')}
              loading="lazy"
            />
          </div>
        </div>

        <div className="who-copy">
          <p className="who-eyebrow">{t('nav.about')}</p>
          <h2>{t('about.heading')}</h2>
          <p>
            <Trans
              i18nKey="about.homeIntro"
              components={{ location: <strong>{SITE.location}</strong> }}
            />
          </p>
          <p>{t('about.homeDetail')}</p>
          <Link className="who-btn" to="/about/">
            {t('common.learnMore')} →
          </Link>

          <h3>{t('about.coreValues')}</h3>
          <ul className="who-values">
            {t('about.coreValuesItems', { returnObjects: true }).map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
