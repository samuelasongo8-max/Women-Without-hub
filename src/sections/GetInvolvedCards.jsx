import { Link } from 'react-router-dom'
import { FaGraduationCap } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal.jsx'
import './GetInvolvedCards.css'

/**
 * Hero configuration — edit here to change kicker, heading or hero image.
 */
const GI_CONFIG = {  
  kickerKey: 'getInvolvedCards.kicker',
  headingKey: 'getInvolvedCards.heading',
  heroImage: '/images/get-involved-feature-desktop.jpg',
  heroAltKey: 'getInvolvedCards.heroAlt',
}

/**
 * Four cards: title, text, link label, href, image, alt.
 * Skills card has no image — uses an icon instead.
 * Edit this array to add, remove or reorder cards.
 */
const GI_CARDS = [
  {
    key: 'donate',
    titleKey: 'getInvolvedCards.cardDonate.title',
    textKey: 'getInvolvedCards.cardDonate.text',
    linkLabelKey: 'getInvolvedCards.cardDonate.linkLabel',
    href: '/get-involved/donate/',
    img: '/images/get-involved-donate.jpg',
    altKey: 'getInvolvedCards.cardDonate.alt',
  },
  {
    key: 'partner',
    titleKey: 'getInvolvedCards.cardPartner.title',
    textKey: 'getInvolvedCards.cardPartner.text',
    linkLabelKey: 'getInvolvedCards.cardPartner.linkLabel',
    href: '/contact',
    img: '/images/get-involved-partner.jpg',
    altKey: 'getInvolvedCards.cardPartner.alt',
  },
  {
    key: 'volunteer',
    titleKey: 'getInvolvedCards.cardVolunteer.title',
    textKey: 'getInvolvedCards.cardVolunteer.text',
    linkLabelKey: 'getInvolvedCards.cardVolunteer.linkLabel',
    href: '/get-involved/volunteer/',
    img: '/images/get-involved-volunteer.jpg',
    altKey: 'getInvolvedCards.cardVolunteer.alt',
  },
  {
    key: 'skills',
    titleKey: 'getInvolvedCards.cardSkills.title',
    textKey: 'getInvolvedCards.cardSkills.text',
    linkLabelKey: 'getInvolvedCards.cardSkills.linkLabel',
    href: '/get-involved/volunteer/',
    img: null,
    icon: <FaGraduationCap aria-hidden="true" />,
    altKey: 'getInvolvedCards.cardSkills.alt',
  },
]

export default function GetInvolvedCards() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  return (
    <section className={`gi-cards${isRtl ? ' gi-cards--rtl' : ''}`} aria-labelledby="gi-heading">
      {/* ---------- Split hero ---------- */}
      <div className="gi-hero">
        <div className="gi-hero-panel gi-hero-panel--text">
          <Reveal as="span" className="gi-kicker" direction="up" delay={0} duration={650}>
            {t(GI_CONFIG.kickerKey)}
          </Reveal>
          <Reveal as="h2" id="gi-heading" className="gi-heading" direction="up" delay={90} duration={650}>
            {t(GI_CONFIG.headingKey)}
          </Reveal>
          <Reveal as="p" className="gi-hero-intro" direction="up" delay={180} duration={650}>
            {t('getInvolvedCards.intro')}
          </Reveal>
        </div>
        <div className="gi-hero-panel gi-hero-panel--image">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/get-involved-feature-mobile.webp"
              type="image/webp"
            />
            <source
              srcSet={GI_CONFIG.heroImage.replace('.jpg', '.webp')}
              type="image/webp"
            />
            <img
              className="gi-hero-img"
              src={GI_CONFIG.heroImage}
              alt={t(GI_CONFIG.heroAltKey)}
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="2899"
            />
          </picture>
        </div>
      </div>

      {/* ---------- Cards grid (no overlap with hero heading) ---------- */}
      <div className="gi-cards-grid">
        {GI_CARDS.map((card, index) => (
          <Reveal
            key={card.key}
            as="article"
            className="gi-card"
            direction={index % 2 === 0 ? 'left' : 'right'}
            delay={index * 120}
            duration={650}
          >
            <div className="gi-card__image">
              {card.img ? (
                <picture>
                  <source srcSet={card.img.replace('.jpg', '.webp')} type="image/webp" />
                  <img
                    src={card.img}
                    alt={t(card.altKey)}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="250"
                    style={{ aspectRatio: '16 / 10' }}
                  />
                </picture>
              ) : (
                <div className="gi-card__icon">{card.icon}</div>
              )}
            </div>
            <div className="gi-card__body">
              <h3 className="gi-card__title">{t(card.titleKey)}</h3>
              <p className="gi-card__text">{t(card.textKey)}</p>
              <Link
                to={card.href}
                className="gi-card__link"
              >
                {t(card.linkLabelKey)}
                <span className="gi-card__arrow">→</span>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
