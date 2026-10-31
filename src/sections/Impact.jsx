import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import './Impact.css'

const stats = [
  { value: 200, suffix: '+', label: 'impact.sectionStats.reached' },
  { value: 6, suffix: '', label: 'impact.sectionStats.programmes' },
  { value: 1, suffix: '', label: 'impact.sectionStats.locations' },
]

export default function ImpactSection() {
  const { t } = useTranslation()

  const sectionRef = useRef(null)
  const [countProgress, setCountProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    let animationFrame = 0
    let startTime
    let observer

    const startCount = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setCountProgress(1)
        return
      }

      const animate = (time) => {
        if (startTime === undefined) startTime = time
        const progress = Math.min((time - startTime) / 900, 1)
        setCountProgress(1 - (1 - progress) ** 3)
        if (progress < 1) animationFrame = window.requestAnimationFrame(animate)
      }

      animationFrame = window.requestAnimationFrame(animate)
    }

    if (!('IntersectionObserver' in window)) {
      startCount()
      return () => window.cancelAnimationFrame(animationFrame)
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          startCount()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <section className="auvd-impact" id="our-impact" ref={sectionRef}>
      <div className="auvd-impact-inner">
        <div className="auvd-impact__photo" aria-hidden="true">
          <span className="auvd-impact__stroke auvd-impact__stroke--1" />
          <span className="auvd-impact__stroke auvd-impact__stroke--2" />
          <span className="auvd-impact__stroke auvd-impact__stroke--3" />
          <span className="auvd-impact__stroke auvd-impact__stroke--4" />
          <img
            className="auvd-impact__img"
            src="/Impact%20at%20Women%20without%20border.png"
            alt={t('impact.sectionImageAlt')}
            loading="lazy"
          />
        </div>
        <div className="auvd-impact-text">
          <Reveal as="h2" direction="up" duration={650}>
            {t('nav.impact')}
          </Reveal>
          <Reveal as="p" direction="up" delay={120} duration={650}>
            {t('impact.sectionIntro')}
          </Reveal>
          <Link to="/impact/" className="auvd-impact-btn">
            <span>{t('common.ctaSeeImpact', { defaultValue: 'See our impact' })}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <dl className="auvd-impact-stats">
          {stats.map((s) => (
            <div key={s.label} className="auvd-stat">
              <dt>{t(s.label)}</dt>
              <dd>{Math.round(s.value * countProgress)}{s.suffix}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
