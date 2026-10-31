import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import ProgramHero from '../components/ProgramHero.jsx'
import { breadcrumbListSchema } from '../data/seo.js'
import { breadcrumbsFor } from '../data/site.js'
import FocusArea from '../components/FocusArea.jsx'
import { livelihoodFocusAreas } from '../data/livelihoodFocusAreas.js'
import './ProgramDetail.css'

const LIVELIHOOD_SLUG = 'livelihood-economic-empowerment'

export default function LivelihoodWhatWeDo() {
  const { t } = useTranslation()
  const { pathname, hash } = useLocation()
  const content = t('programs.livelihood.whatWeDo', { returnObjects: true })
  const [revealedCount, setRevealedCount] = useState(0)
  const [announcementTitleKey, setAnnouncementTitleKey] = useState('')
  const [focusTargetNumber, setFocusTargetNumber] = useState(null)
  const focusAreaHeading = useRef(null)
  const nextArea = livelihoodFocusAreas[revealedCount]
  const breadcrumbTrail = breadcrumbsFor(pathname).map((crumb) => ({
    ...crumb,
    label: crumb.isLast ? content.title : t(crumb.labelKey),
  }))

  useEffect(() => {
    const match = /^#area-([1-8])$/.exec(hash)
    if (!match) {
      setRevealedCount(0)
      setFocusTargetNumber(null)
      setAnnouncementTitleKey('')
      return
    }

    const targetNumber = Number(match[1])
    const targetArea = livelihoodFocusAreas[targetNumber - 1]
    setRevealedCount((currentCount) => Math.max(currentCount, targetNumber))
    setFocusTargetNumber(targetNumber)
    setAnnouncementTitleKey(targetArea.titleKey)
  }, [pathname, hash])

  useEffect(() => {
    if (!focusTargetNumber || revealedCount < focusTargetNumber) return

    const area = document.getElementById(`area-${focusTargetNumber}`)
    const heading = focusAreaHeading.current
    if (!area || !heading) return

    heading.focus({ preventScroll: true })
    const bounds = area.getBoundingClientRect()
    const scrollMargin = Number.parseFloat(
      window.getComputedStyle(area).scrollMarginTop,
    )
    const topOffset = Number.isFinite(scrollMargin) ? scrollMargin : 0
    const fullyVisible = bounds.top >= topOffset && bounds.bottom <= window.innerHeight

    if (!fullyVisible) {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      window.scrollTo({
        top: window.scrollY + bounds.top - topOffset,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    }

    setFocusTargetNumber(null)
  }, [focusTargetNumber, revealedCount])

  const revealNextArea = () => {
    if (!nextArea) return

    const nextCount = revealedCount + 1
    setFocusTargetNumber(nextCount)
    setAnnouncementTitleKey(nextArea.titleKey)
    setRevealedCount(nextCount)
  }

  const renderExploreButton = () =>
    nextArea ? (
      <div className="livelihood-what-we-do__explore-wrap">
        <button
          className="livelihood-what-we-do__explore"
          type="button"
          aria-label={t('programs.livelihood.exploreMoreLabel', {
            title: t(nextArea.titleKey),
          })}
          aria-expanded={false}
          aria-controls={nextArea.id}
          onClick={revealNextArea}
        >
          {t('programs.livelihood.exploreMore')}
        </button>
      </div>
    ) : null

  const heroIntro = (
    <div className="program-hero__intro livelihood-what-we-do__hero-intro">
      {content.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {revealedCount === 0 && renderExploreButton()}
    </div>
  )

  return (
    <div className="livelihood-what-we-do-page">
      <ProgramHero
        title={content.title}
        introContent={heroIntro}
        className="program-hero--livelihood-what-we-do"
        image={{
          desktop: '/images/livelihood-what-we-do-hero',
          mobile: '/images/livelihood-what-we-do-hero',
        }}
        breadcrumbTrail={breadcrumbTrail}
      />
      <main className="section container livelihood-content livelihood-what-we-do">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbListSchema(pathname, undefined, t)),
          }}
        />

        <div className="livelihood-what-we-do__areas">
          {livelihoodFocusAreas.map((area) => (
            <FocusArea
              key={area.id}
              id={area.id}
              number={area.number}
              title={t(area.titleKey)}
              paragraphs={area.textKeys.map((textKey) => t(textKey))}
              image={area.image}
              imageAlt={area.imageAlt}
              width={area.width}
              height={area.height}
              imageFocus={area.imageFocus}
              icon={area.icon}
              reverse={area.number % 2 === 1}
              hidden={area.number > revealedCount}
              headingRef={
                area.number === focusTargetNumber ? focusAreaHeading : undefined
              }
              revealing={area.number <= revealedCount}
            />
          ))}
        </div>

        {revealedCount > 0 && renderExploreButton()}
        <p
          className="livelihood-what-we-do__announcement visually-hidden"
          aria-live="polite"
        >
          {announcementTitleKey
            ? t('programs.livelihood.sectionRevealed', {
                title: t(announcementTitleKey),
              })
            : ''}
        </p>

        {revealedCount === livelihoodFocusAreas.length && (
          <div className="livelihood-what-we-do__actions">
            <Link
              className="livelihood-what-we-do__back"
              to={`/programs/${LIVELIHOOD_SLUG}/`}
            >
              <span
                aria-hidden="true"
                className="livelihood-what-we-do__back-arrow"
              >
                ←
              </span>
              {content.backToProgram}
            </Link>
            <Link className="livelihood-partner-link" to="/contact/">
              {content.partner}
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
