import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { maluaLugazoPersonSchema } from '../data/seo.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import './MaluaLugazoProfile.css'

/**
 * MaLua Lugazo — Founder & Executive Director profile.
 * Rendered at /about/our-team/malua-lugazo/ inside the shared Layout,
 * so the normal nav bar and footer are shown.
 *
 * The photo is the same optimized portrait used on her team card.
 */

const PHOTO = '/images/team/malua-lugazo.jpg'

export default function MaluaLugazoProfile() {
  const { t } = useTranslation()
  const content = t('profile', { returnObjects: true })

  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <main className="mlp">
      {/* Person structured data for this profile page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(maluaLugazoPersonSchema()),
        }}
      />

      {/* ---------- 1. HERO ---------- */}
      <section className="mlp-hero">
        <Breadcrumbs />
        <p className="mlp-eyebrow">{content.leadership}</p>
        <h1 className="mlp-title">{content.title}</h1>
        <p className="mlp-intro">{content.heroIntro}</p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 2. PHOTO + ROLE FEATURE ---------- */}
      <section className="mlp-feature">
        <div className="mlp-feature__media">
          {photoFailed ? (
            <div className="mlp-photo mlp-photo--fallback" aria-hidden="true">
              ML
            </div>
          ) : (
            <img
              className="mlp-photo"
              src={PHOTO}
              alt={content.photoAlt}
              loading="eager"
              decoding="async"
              width="280"
              height="375"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>

        <div className="mlp-feature__body">
          <h2 className="mlp-h2">{content.founderLeader}</h2>
          {content.featureParagraphs.map((text) => (
            <p key={text.slice(0, 32)} className="mlp-p">
              {text}
            </p>
          ))}
          <hr className="mlp-rule" />
          <p className="mlp-role">
            <strong>{content.officialRoleLabel}</strong> {content.officialRole}
          </p>

          <div className="mlp-links">
            <Link className="mlp-link" to="/about/our-team/">
              {content.meetTeam}
            </Link>
            <Link className="mlp-link" to="/about/our-story/">
              {content.readStory}
            </Link>
          </div>
        </div>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 3. MOTIVATION ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.motivation}</h2>
        {content.motivationParagraphs.map((text) => (
          <p key={text.slice(0, 32)} className="mlp-p">{text}</p>
        ))}
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 4. KAKUMA BARRIERS ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.barriersTitle}</h2>
        <p className="mlp-p">{content.barriersIntro}</p>
        <ul className="mlp-list">
          {content.barriers.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 5. PROBLEM ADDRESSED ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.problemTitle}</h2>
        {content.problemParagraphs.map((text) => (
          <p key={text.slice(0, 32)} className="mlp-p">{text}</p>
        ))}
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 6. FIVE FOCUS AREAS ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.focusAreasTitle}</h2>
        <div className="mlp-focus">
          {content.focusAreas.map((area) => (
            <article key={area.title} className="mlp-focus__card">
              <h3 className="mlp-focus__title">{area.title}</h3>
              <p className="mlp-focus__text">{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 7. MISSION ---------- */}
      <section className="mlp-section mlp-section--mission">
        <h2 className="mlp-h2">{content.missionTitle}</h2>
        <p className="mlp-mission">{content.mission}</p>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 8. ORGANIZATIONAL CHALLENGES ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.challengesTitle}</h2>
        <p className="mlp-p">{content.challengesIntro}</p>
        <ul className="mlp-list">
          {content.challenges.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 9. DESIRED CHANGE ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.changeTitle}</h2>
        {content.changeParagraphs.map((text) => (
          <p key={text.slice(0, 32)} className="mlp-p">{text}</p>
        ))}
      </section>

      <hr className="mlp-rule" />

      {/* ---------- 10. LONG-TERM VISION ---------- */}
      <section className="mlp-section">
        <h2 className="mlp-h2">{content.visionTitle}</h2>
        <p className="mlp-p">{content.longTermVision}</p>
      </section>

      {/* ---------- 11. CLOSING CTA BAND ---------- */}
      <section className="mlp-cta">
        <h2 className="mlp-cta__title">{content.support}</h2>
        <p className="mlp-cta__text">{content.closing}</p>
        <div className="mlp-cta__actions">
          <Link className="mlp-btn mlp-btn--primary" to="/get-involved/donate/">
            {t('nav.donate')}
          </Link>
          <Link className="mlp-btn mlp-btn--ghost" to="/get-involved/partner/">
            {t('getInvolvedCards.cardPartner.title')}
          </Link>
        </div>
      </section>
    </main>
  )
}
