import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import ProgramHero from '../components/ProgramHero.jsx'
import SplitPanelList from '../components/SplitPanelList.jsx'
import { breadcrumbListSchema } from '../data/seo.js'
import { breadcrumbsFor } from '../data/site.js'
import './ProgramDetail.css'
import './LivelihoodOurApproach.css'

const LIVELIHOOD_SLUG = 'livelihood-economic-empowerment'

export default function LivelihoodOurApproach() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const content = t('programs.livelihood.ourApproach', {
    returnObjects: true,
    defaultValue: {},
  })
  const breadcrumbLabels = [
    t('breadcrumb.home', { defaultValue: 'Home' }),
    t('breadcrumb.programs', { defaultValue: 'Programs' }),
    content.programTitle,
    content.title,
  ]
  const breadcrumbTrail = breadcrumbsFor(pathname).map((crumb, index) => ({
    ...crumb,
    label: breadcrumbLabels[index] || crumb.label,
  }))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <ProgramHero
        title={content.title}
        intro={content.intro}
        className="program-hero--livelihood"
        image={{
          desktop: '/images/livelihood-hero',
          mobile: '/images/livelihood-hero',
        }}
        breadcrumbTrail={breadcrumbTrail}
      />
      <main className="section container livelihood-content livelihood-approach-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbListSchema(pathname, breadcrumbLabels),
            ),
          }}
        />
        <SplitPanelList
          title={content.title}
          image="/images/livelihood/area-1-business-development.jpg"
          imageAlt={content.imageAlt}
          items={content.items.map((item, index) => ({
            number: index + 1,
            title: item.title,
            text: item.text,
          }))}
        />
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
