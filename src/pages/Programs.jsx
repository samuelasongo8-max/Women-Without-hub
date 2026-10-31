import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { programImages } from '../data/programImages.js'
import srhrVideo from '../sections/video/Sexual & Reproductive Health and Rights video(SRHR).mp4'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import { programs } from '../data/site.js'
// Reuse the exact stylesheet of the home "Our Programs" section (after
// Community Updates) so the page shares its design language 1:1.
// Importing it does not modify the section component.
import '../sections/Programs.css'
// Page-scoped styles: photo background for this page's top header only.
import './Programs.css'

// Programme strip palette: teal / yellow / coral (same as the section).
const T = '#1e8e96'
const Y = '#f6b95c'
const C = '#ef6f52'

// Coloured icons keyed by program slug — same artwork as the section.
const icons = {
  'second-chance-education': (
    <>
      <path d="M4 10c9-3 15-1 20 4v26c-5-5-11-7-20-4z" fill={T} />
      <path d="M44 10c-9-3-15-1-20 4v26c5-5 11-7 20-4z" fill={C} />
    </>
  ),
  'digital-technical-skills': (
    <>
      <rect x="8" y="9" width="32" height="23" rx="3" fill={T} />
      <path d="M3 36h42l-3 5H6z" fill={Y} />
    </>
  ),
  'mentorship-life-skills': (
    <>
      <circle cx="17" cy="13" r="7" fill={T} />
      <circle cx="34" cy="17" r="6" fill={C} />
      <path d="M5 42c0-12 6-17 12-17s12 5 12 17z" fill={T} />
      <path d="M27 42c0-8 3-12 7-12s9 4 9 12z" fill={Y} />
    </>
  ),
  'health-menstrual-dignity': (
    <path
      d="M24 4C14 18 10 24 10 31a14 14 0 0 0 28 0c0-7-4-13-14-27z"
      fill={C}
    />
  ),
  srhr: (
    <>
      <path
        d="M24 42C8 30 6 22 6 16a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 6-2 14-18 26z"
        fill={T}
      />
      <circle cx="36" cy="10" r="5" fill={Y} />
    </>
  ),
  'livelihood-economic-empowerment': (
    <>
      <path d="M24 4c7 5 7 14 0 19-7-5-7-14 0-19z" fill={C} />
      <path
        d="M24 26c-2-7-9-9-16-7 0 7 7 11 16 7zM24 26c2-7 9-9 16-7 0 7-7 11-16 7z"
        fill={Y}
      />
      <path d="M24 24v18" stroke={T} strokeWidth="3" />
      <path d="M14 43h20l-3-5H17z" fill={T} />
    </>
  ),
}

export default function Programs() {
  const { t } = useTranslation()
  const visiblePrograms = programs.filter(
    (program) => program.slug !== 'digital-technical-skills',
  )

  useHeroImagePreload({
    desktop: '/images/programs-banner-desktop.webp',
    mobile: '/images/programs-banner-mobile.webp',
  })

  return (
    <>
      {/* Top header — identical markup/classes to PageHeader (same layout,
          typography, breadcrumbs), plus the auvd-programs-hero modifier that
          adds this page's photo background. PageHeader stays untouched for
          the other pages. */}
      <section className="page-header auvd-programs-hero">
        <Breadcrumbs />
        <div className="container">
          <h1>{t('programs.title')}</h1>
          <p className="page-intro">
            {t('programs.indexIntro')}
          </p>
        </div>
      </section>

      {/* Same design as the home "Our Programs" section: centred cells,
          vertical dividers, coloured icons, teal titles, coral links. */}
      <section className="home-programs">
        <div className="container">
          <div className="home-programs-grid">
            {visiblePrograms.map((p) => (
              <article key={p.slug} className="home-program">
              {(() => {
                const img = programImages[p.slug]
                return (
                  <div className="home-program-image-wrap">
                    <img
                      className="home-program-image"
                      src={encodeURI(img.image)}
                      alt={t(img.altKey)}
                      loading="lazy"
                      decoding="async"
                      width="1200"
                      height="800"
                      style={{ objectPosition: img.objectPosition }}
                    />
                  </div>
                )
              })()}
                <svg
                  className="home-program-icon"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  {icons[p.slug]}
                </svg>
                <h3>
                  <Link to={`/programs/${p.slug}/`}>
                    {p.slug === 'second-chance-education'
                      ? t('programs.secondChanceTitle')
                      : t(`programs.cards.${p.slug}.title`)}
                  </Link>
                </h3>
                <p>{t(`programs.cards.${p.slug}.summary`)}</p>
                <Link to={`/programs/${p.slug}/`} className="home-program-link">
                  {t('common.learnMore')} →
                </Link>
              {p.slug === 'srhr' && (
                <div className="home-program-video-wrap">
                  <video
                    className="home-program-video"
                    src={srhrVideo}
                    poster="/images/srhr.jpg"
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={t('programs.videoAria')}
                  >
                    {t('programs.videoFallback')}
                  </video>
                  <h4 className="home-program-video-title">
                    {t('programs.videoTitle')}
                  </h4>
                  <p className="home-program-video-text">
                    {t('programs.videoDescription')}
                  </p>
                </div>
              )}
              </article>
            ))}
            <div className="home-program-fill">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/programs-fill.webp"
                  media="(min-width: 1024px)"
                />
                <source
                  type="image/jpeg"
                  srcSet="/images/programs-fill.jpg"
                  media="(min-width: 1024px)"
                />
                <img
                  className="home-program-fill-image"
                  src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  alt={t('programs.fillImageAlt')}
                  width="900"
                  height="1350"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
