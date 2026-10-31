import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { donateCta } from '../data/site.js'
import { ORG_NAME } from '../config/site.js'
import './OurStory.css'

/**
 * Our Story - the founder story of the organization.
 * Sub-page of About at /about/our-story/.
 * Layout: teal banner -> solid pink founder section (auvd-founder).
 */
export default function OurStory() {
  const { t } = useTranslation()

  return (
    <article className="story-page">
      <header className="story-banner auvd-story-hero">
        <div className="container auvd-story-content">
          <h1 className="story-title">
            {t('ourStory.pageTitle')}
          </h1>
          <p className="story-lead">
            {t('ourStory.lead')}
          </p>
        </div>
      </header>

      <section className="auvd-founder">
        <div className="auvd-founder__inner">
          <div className="auvd-founder__left">
            <div className="auvd-founder__media">
              <div className="auvd-person">
                <picture>
                  <source
                    srcSet="/images/malua-lugazo.webp"
                    type="image/webp"
                  />
                  <img
                    className="auvd-person__img"
                    src="/images/malua-lugazo.jpg"
                    alt={t('ourStory.photoAlt')}
                    loading="eager"
                    fetchPriority="high"
                    width="280"
                    height="375"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="auvd-founder__bubble">
                <div className="auvd-founder__bubble-inner">
                  <p className="auvd-founder__quote">
                    {t('ourStory.quote')}
                  </p>
                  <p className="auvd-founder__cite">
                    {t('ourStory.quoteAttribution')}
                  </p>
                </div>
              </div>
            </div>

            <div className="auvd-founder__blocks">
              <div className="auvd-founder__block">
                <h2>{t('ourStory.fromKakuma', { defaultValue: 'From Kakuma to Hope' })}</h2>
                <p>{t('ourStory.fromKakumaText')}</p>
              </div>

              <div className="auvd-founder__block">
                <h2>{t('ourStory.whyHub', { defaultValue: `Why ${ORG_NAME}` })}</h2>
                <p>{t('ourStory.whyHubText')}</p>
              </div>
            </div>
          </div>

          <div className="auvd-founder__right">
            <h2 className="auvd-founder__heading">
              {t('ourStory.whatWe')}
              <br />
              {t('ourStory.do')}
            </h2>
            <p className="auvd-founder__intro">
              {t('ourStory.closingText')}
            </p>

            <ul className="auvd-founder__links">
              <li>
                <Link to="/programs/">
                  {t('nav.programs')} <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link to="/impact/">
                  {t('nav.impact')} <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link to="/updates/">
                  {t('updates.title')} <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link to="/get-involved/">
                  {t('nav.getInvolved')} <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>

            <div className="auvd-founder__actions">
              <Link
                className="auvd-founder__btn auvd-founder__btn--donate"
                to={donateCta.to}
              >
                {t('nav.donate')}
              </Link>
              <Link
                className="auvd-founder__btn auvd-founder__btn--contact"
                to="/contact/"
              >
                {t('ourStory.contactUs')}
              </Link>
            </div>

            {/* Decorative photo — desktop only (hidden on tablet/phone via CSS). */}
            <img
              className="auvd-founder__aside-img"
              src="/images/women-hub7.png"
              alt={`Women of ${ORG_NAME} in Kakuma`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </article>
  )
}
