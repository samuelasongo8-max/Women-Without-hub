import { useEffect } from 'react'
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
  const { pathname } = useLocation()
  const content = t('programs.livelihood.whatWeDo', { returnObjects: true })
  const breadcrumbTrail = breadcrumbsFor(pathname).map((crumb) => ({
    ...crumb,
    label: crumb.isLast ? content.title : crumb.label,
  }))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const heroIntro = (
    <div className="program-hero__intro livelihood-what-we-do__hero-intro">
      {content.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )

  return (
    <>
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
            __html: JSON.stringify(breadcrumbListSchema(pathname)),
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
            />
          ))}
        </div>

        <div className="livelihood-what-we-do__actions">
          <Link
            className="livelihood-what-we-do__back"
            to={`/programs/${LIVELIHOOD_SLUG}/`}
          >
            <span aria-hidden="true" className="livelihood-what-we-do__back-arrow">
              ←
            </span>
            {content.backToProgram}
          </Link>
          <Link className="livelihood-partner-link" to="/contact/">
            {content.partner}
          </Link>
        </div>
      </main>
    </>
  )
}
