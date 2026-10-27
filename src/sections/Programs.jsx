import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Programs.css'
import srhrVideo from './video/Sexual & Reproductive Health and Rights video(SRHR).mp4'
import { programImages } from '../data/programImages.js'

// Programme strip palette: teal / yellow / coral.
const T = '#1e8e96'
const Y = '#f6b95c'
const C = '#ef6f52'

// The six programmes rendered as a coloured-icon strip.
// Relative routes only — never a full http://localhost URL.
const programs = [
  {
    slug: 'second-chance-education',
    to: '/programs/second-chance-education/',
    icon: (
      <>
        <path d="M4 10c9-3 15-1 20 4v26c-5-5-11-7-20-4z" fill={T} />
        <path d="M44 10c-9-3-15-1-20 4v26c5-5 11-7 20-4z" fill={C} />
      </>
    ),
    img: programImages['second-chance-education'],
  },
  {
    slug: 'mentorship-life-skills',
    to: '/programs/mentorship-life-skills/',
    icon: (
      <>
        <circle cx="17" cy="13" r="7" fill={T} />
        <circle cx="34" cy="17" r="6" fill={C} />
        <path d="M5 42c0-12 6-17 12-17s12 5 12 17z" fill={T} />
        <path d="M27 42c0-8 3-12 7-12s9 4 9 12z" fill={Y} />
      </>
    ),
    img: programImages['mentorship-life-skills'],
  },
  {
    slug: 'health-menstrual-dignity',
    to: '/programs/health-menstrual-dignity/',
    icon: (
      <path
        d="M24 4C14 18 10 24 10 31a14 14 0 0 0 28 0c0-7-4-13-14-27z"
        fill={C}
      />
    ),
    img: programImages['health-menstrual-dignity'],
  },
  {
    slug: 'srhr',
    to: '/programs/srhr/',
    icon: (
      <>
        <path
          d="M24 42C8 30 6 22 6 16a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 6-2 14-18 26z"
          fill={T}
        />
        <circle cx="36" cy="10" r="5" fill={Y} />
      </>
    ),
    img: programImages.srhr,
  },
  {
    slug: 'livelihood-economic-empowerment',
    to: '/programs/livelihood-economic-empowerment/',
    icon: (
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
    img: programImages['livelihood-economic-empowerment'],
  },
]

export default function Programs() {
  const { t } = useTranslation()

  return (
    <section className="home-programs home-programs--home">
      <div className="container">
        <h2>{t('programs.homeTitle')}</h2>
        <p className="section-intro">
          {t('programs.homeIntro')}
        </p>

        <div className="home-programs-grid">
          {programs.map(({ slug, to, icon, img }) => (
            <article key={to} className="home-program">
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
              <svg
                className="home-program-icon"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                {icon}
              </svg>
              <h3>
                <Link to={to}>
                  {slug === 'second-chance-education'
                    ? t('programs.secondChanceTitle')
                    : t(`programs.cards.${slug}.title`)}
                </Link>
              </h3>
              <p>{t(`programs.cards.${slug}.summary`)}</p>
              <Link to={to} className="home-program-link">
                {t('common.learnMore')} →
              </Link>

              {slug === 'srhr' && (
                <div className="home-program-video-wrap">
                  <video
                    className="home-program-video"
                    src={srhrVideo}
                    poster={encodeURI('/Sexual & Reproductive Health and Rights (SRHR).jpg')}
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
  )
}
