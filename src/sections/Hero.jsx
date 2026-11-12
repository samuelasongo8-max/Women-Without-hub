import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { donateCta } from '../data/site.js'
import { ORG_NAME } from '../config/site.js'
import Reveal, { SplitWords } from '../components/Reveal.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import './Hero.css'

const countWords = (text) => text.trim().split(/\s+/u).filter(Boolean).length

export default function Hero() {
  const { t } = useTranslation()
  const titlePrefix = t('homeHero.titlePrefix')
  const girls = t('homeHero.girls')
  const connector = t('homeHero.connector')
  const youngWomen = t('homeHero.youngWomen')
  const location = t('homeHero.location')
  const phraseStart = countWords(titlePrefix) + 2
  const youngWomenStart = phraseStart + countWords(girls) + countWords(connector)
  const locationStart = youngWomenStart + countWords(youngWomen)
  const headingWordCount = locationStart + countWords(location)
  const headingFinishDelay = headingWordCount * 80 + 650

  return (
    <section className="hero">
      <div className="hero-area">
        {/* Decorative diagonal brush — top-left corner */}
        <svg className="hero-corner" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <path
            className="hero-fill-yellow"
            d="M-20 58C8 24 48-4 96-18c-14 34-34 64-54 94-20 18-44 8-62-18z"
          />
          <path
            className="hero-fill-coral"
            d="M32 132c40-46 92-82 152-98-16 36-36 66-66 96-26 24-62 24-86 2z"
          />
        </svg>

        {/* Decorative curved swoosh — bottom-right corner */}
        <svg className="hero-swoosh" viewBox="0 0 260 180" aria-hidden="true" focusable="false">
          <path className="hero-stroke-teal" d="M12 170C70 150 150 100 212 22" />
          <path className="hero-stroke-yellow" d="M42 177C102 161 176 116 236 48" />
          <path className="hero-stroke-coral" d="M74 180C132 169 196 131 253 74" />
        </svg>

        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal
              as="h1"
              className="hero-title"
              direction="up"
              duration={650}
              playOnMount
              wordStagger
            >
              <SplitWords>{titlePrefix}</SplitWords>
              <br />
              <span className="hero-h1-yellow">
                <SplitWords startIndex={phraseStart}>{girls}</SplitWords>
              </span>{' '}
              <SplitWords startIndex={phraseStart + countWords(girls)}>
                {connector}
              </SplitWords>{' '}
              <span className="hero-h1-coral">
                <SplitWords startIndex={youngWomenStart}>{youngWomen}</SplitWords>
              </span>
              <br />
              <SplitWords startIndex={locationStart}>{location}</SplitWords>
            </Reveal>
            <Reveal
              as="p"
              className="hero-lead"
              direction="up"
              delay={headingFinishDelay}
              playOnMount
            >
              {t('homeHero.lead')}
            </Reveal>
            <div className="hero-actions">
              <Reveal
                as={Link}
                to={donateCta.to}
                className="hero-btn hero-btn-fill"
                direction="up"
                delay={headingFinishDelay + 760}
                playOnMount
              >
                {t('nav.donate')} <span aria-hidden="true">→</span>
              </Reveal>
              <Reveal
                as={Link}
                to="/programs/"
                className="hero-btn hero-btn-outline"
                direction="up"
                delay={headingFinishDelay + 900}
                playOnMount
              >
                {t('homeHero.programs')}
              </Reveal>
            </div>

            {/* Social icon row — sits directly below the two buttons, above the
                photo overlay (z-index handled in Hero.css). */}
            <SocialLinks
              className="hero-social-icons"
              linkClassName="hero-social-link"
              platformClassPrefix="hero-social"
              labelFor={(platform) => t(`homeHero.${platform}`, { name: ORG_NAME })}
            />
          </div>

          <div className="hero-art">
            <span className="hero-brush hero-brush-a" aria-hidden="true" />
            <span className="hero-brush hero-brush-b" aria-hidden="true" />
            <span className="hero-brush hero-brush-c" aria-hidden="true" />
            <img
              className="hero-photo"
              src="/images/graduation-at-women-without-border.jpg"
              alt={t('homeHero.photoAlt')}
              width="800"
              height="600"
              loading="eager"
              decoding="async"
            />
            <p className="hero-script">
              {t('homeHero.realPeople')}
              <br />
              {t('homeHero.realChange')}
            </p>
          </div>
        </div>
      </div>

      {/* STATS_STRIP */}
    </section>
  )
}
