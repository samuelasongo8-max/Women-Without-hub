import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './HeroSlideB.css'

export default function HeroSlideB({ imageLoaded }) {
  const { t } = useTranslation()

  return (
    <div className={`hero-slide-b${imageLoaded ? ' hero-slide-b--image-ready' : ''}`}>
      <div
        className="hero-slide-b__photo"
        role="img"
        aria-label={t('homeHero.slideTwoPhotoAlt')}
      />
      <div className="hero-slide-b__copy">
        <h2 className="hero-slide-b__title">
          <span>{t('homeHero.slideTwoLineOne')}</span>
          <span className="hero-slide-b__title-accent">
            {t('homeHero.slideTwoLineTwo')}
          </span>
          <span>{t('homeHero.slideTwoLineThree')}</span>
        </h2>
        <p className="hero-slide-b__lead">{t('homeHero.slideTwoLead')}</p>
        <div className="hero-slide-b__actions">
          <Link className="hero-slide-b__button hero-slide-b__button--story" to="/about/our-story/">
            {t('homeHero.slideTwoStory')}
          </Link>
          <Link className="hero-slide-b__button hero-slide-b__button--support" to="/get-involved/donate/">
            {t('homeHero.slideTwoSupport')}
          </Link>
        </div>
      </div>
    </div>
  )
}
