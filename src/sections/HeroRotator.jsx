import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Hero from './Hero.jsx'
import HeroSlideB from './HeroSlideB.jsx'
import './HeroRotator.css'

const HERO_ROTATE_MS = 25000

export default function HeroRotator() {
  const { t } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(
    () => document.visibilityState === 'visible',
  )
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [imageLoaded, setImageLoaded] = useState(false)

  const rotating =
    !paused && !hovered && !focusWithin && documentVisible && !reducedMotion

  useEffect(() => {
    let timer
    let idleCallback
    let cancelled = false
    const startImageDelay = () => {
      if (cancelled) return
      timer = window.setTimeout(() => setImageLoaded(true), 5000)
    }

    if ('requestIdleCallback' in window) {
      idleCallback = window.requestIdleCallback(startImageDelay, { timeout: 5000 })
    } else {
      timer = window.setTimeout(startImageDelay, 1000)
    }

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (idleCallback !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallback)
      }
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMotionPreference)
    } else {
      mediaQuery.addListener(updateMotionPreference)
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMotionPreference)
      } else {
        mediaQuery.removeListener(updateMotionPreference)
      }
    }
  }, [])

  useEffect(() => {
    const updateVisibility = () =>
      setDocumentVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', updateVisibility)
    return () =>
      document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    if (!rotating) return undefined

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current === 0 ? 1 : 0))
    }, HERO_ROTATE_MS)
    return () => window.clearTimeout(timer)
  }, [activeSlide, rotating])

  const toggleRotation = () => {
    setPaused((current) => !current)
  }

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusWithin(false)
    }
  }

  return (
    <div
      className="hero-rotator"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('homeHero.featuredMessage')}
      aria-live={rotating ? 'off' : 'polite'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={handleBlur}
    >
      <div
        className={`hero-rotator__slide hero-rotator__slide--one${activeSlide === 0 ? ' is-active' : ' is-inactive'}`}
        role="group"
        aria-roledescription="slide"
        aria-label={t('homeHero.slideOneLabel')}
        aria-hidden={activeSlide !== 0}
        inert={activeSlide !== 0 ? '' : undefined}
      >
        <Hero />
      </div>
      <div
        className={`hero-rotator__slide hero-rotator__slide--two${activeSlide === 1 ? ' is-active' : ' is-inactive'}`}
        role="group"
        aria-roledescription="slide"
        aria-label={t('homeHero.slideTwoLabel')}
        aria-hidden={activeSlide !== 1}
        inert={activeSlide !== 1 ? '' : undefined}
      >
        <HeroSlideB imageLoaded={imageLoaded} />
      </div>
      <div className="hero-rotator__arrows">
        <button
          className="hero-rotator__arrow hero-rotator__arrow--previous"
          type="button"
          aria-label={t('homeHero.showSlideOne')}
          onClick={() => setActiveSlide(0)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          className="hero-rotator__arrow hero-rotator__arrow--next"
          type="button"
          aria-label={t('homeHero.showSlideTwo')}
          onClick={() => setActiveSlide(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <button
        className="hero-rotator__toggle"
        type="button"
        aria-label={t(paused ? 'homeHero.playRotation' : 'homeHero.pauseRotation')}
        aria-pressed={paused}
        onClick={toggleRotation}
      >
        {t(paused ? 'homeHero.playRotation' : 'homeHero.pauseRotation')}
      </button>
    </div>
  )
}
