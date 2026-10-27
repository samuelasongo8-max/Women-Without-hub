import { useParams, Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProgramHero from '../components/ProgramHero.jsx'
import SplitPanelList from '../components/SplitPanelList.jsx'
import { FaBookOpen } from 'react-icons/fa'
import { programImages } from '../data/programImages.js'
import { programs } from '../data/site.js'
import { breadcrumbListSchema } from '../data/seo.js'
import livelihoodMarkdown from '../content/livelihood-economic-empowerment.en.md?raw'
import './ProgramDetail.css'

const LIVELIHOOD_SLUG = 'livelihood-economic-empowerment'

// Optional optimized desktop/mobile hero photos per programme slug.
// Programmes without an entry use a plain teal gradient banner.
const PROGRAM_HERO_IMAGES = {
  'second-chance-education': {
    desktop: '/images/program-education-banner-desktop',
    mobile: '/images/program-education-banner-mobile',
  },
  'digital-technical-skills': {
    desktop: '/images/program-digital-banner-desktop',
    mobile: '/images/program-digital-banner-mobile',
  },
  'mentorship-life-skills': {
    desktop: '/images/program-mentorship-banner-desktop',
    mobile: '/images/program-mentorship-banner-mobile',
  },
  'health-menstrual-dignity': {
    desktop: '/images/program-education-banner-desktop',
    mobile: '/images/program-education-banner-mobile',
  },
  srhr: {
    desktop: '/images/program-srhr-banner-desktop',
    mobile: '/images/program-srhr-banner-mobile',
  },
  [LIVELIHOOD_SLUG]: {
    desktop: '/images/livelihood-hero-12',
    mobile: '/images/livelihood-hero-12',
  },
}

function parseLivelihoodContent(markdown) {
  const lines = markdown.trim().split(/\r?\n/)
  const document = {
    title: lines[0].replace(/^#\s+/, '').trim(),
    subtitle: lines[2].replace(/^###\s+/, '').trim(),
    intro: [],
    sections: [],
  }
  let section = null
  let paragraphLines = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return

    const paragraph = paragraphLines.join(' ').trim()
    paragraphLines = []
    if (!section) {
      document.intro.push(paragraph)
    } else {
      section.paragraphs.push(paragraph)
    }
  }

  for (const line of lines.slice(3)) {
    if (!line.trim()) {
      flushParagraph()
      continue
    }

    if (line.startsWith('## ')) {
      flushParagraph()
      section = {
        title: line.replace(/^##\s+/, '').trim(),
        paragraphs: [],
      }
      document.sections.push(section)
      continue
    }

    paragraphLines.push(line)
  }
  flushParagraph()

  return document
}

const LIVELIHOOD_CONTENT = parseLivelihoodContent(livelihoodMarkdown)
const LIVELIHOOD_SECTION_IDS = [
  'why-it-matters',
  'who-we-support',
  'working-together',
]

function LivelihoodContent({
  pathname,
  whyImage,
  supportImage,
  supportImageAlt,
  workingImage,
}) {
  const { t } = useTranslation()
  const sections = LIVELIHOOD_CONTENT.sections

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbListSchema(pathname)),
        }}
      />
      <div className="livelihood-intro">
        {LIVELIHOOD_CONTENT.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {sections.map((section, index) => {
        const sectionImage =
          index === 0
            ? whyImage
            : index === 1
              ? supportImage
              : index === 2
                ? workingImage
                : null
        const imageAltKey =
          index === 0
            ? 'programs.livelihood.whyImageAlt'
            : index === 1
              ? supportImageAlt
              : 'programs.livelihood.workingImageAlt'
        const hasImage = Boolean(sectionImage)
        const imageDimensions =
          index === 0
            ? { width: 1000, height: 1250 }
            : { width: 800, height: 800 }
        const isWorkingTogether =
          section.title === 'Working Together to Create Opportunities'
        const partnerLink = isWorkingTogether ? (
          <Link
            className="livelihood-partner-link livelihood-program-button"
            to="/contact/"
          >
            Partner with us
          </Link>
        ) : null
        const whyActions =
          index === 0 ? (
            <div className="livelihood-why-actions">
              <Link
                className="livelihood-program-button"
                to="/programs/livelihood-economic-empowerment/what-we-do/"
              >
                {t('programs.livelihood.exploreMore', {
                  defaultValue: 'Explore more',
                })}
              </Link>
              <Link
                className="livelihood-program-button"
                to="/programs/livelihood-economic-empowerment/our-approach/"
              >
                {t('programs.livelihood.ourApproach.title', {
                  defaultValue: 'Our Approach',
                })}
              </Link>
            </div>
          ) : null
        const textContent = (
          <>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraph}>
                {paragraphIndex === 1 && isWorkingTogether
                  ? paragraph.replace(
                      'Women Without Borders Hub',
                      t('programs.livelihood.organizationName', {
                        defaultValue: 'Women Without Borders Hub',
                      }),
                    )
                  : paragraph}
              </p>
            ))}
          </>
        )

        return (
          <section
            className={`livelihood-section${hasImage ? ` livelihood-section--with-image${index === 1 ? ' livelihood-section--support-image' : ''}${index === 2 ? ' livelihood-section--working-image' : ''}` : ''}`}
            id={LIVELIHOOD_SECTION_IDS[index]}
            key={section.title}
          >
            {hasImage ? (
              <>
                <div className="livelihood-section__text">
                  {textContent}
                  {whyActions}
                  {partnerLink}
                </div>
                <picture className="livelihood-section__image">
                  <source
                    srcSet={`${sectionImage}.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`${sectionImage}.jpg`}
                    alt={t(imageAltKey, {
                      defaultValue:
                        'Women and girls taking part in a livelihood programme in Kakuma',
                    })}
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </>
            ) : (
              <>
                {textContent}
                {whyActions}
                {partnerLink}
              </>
            )}
          </section>
        )
      })}
    </>
  )
}

export default function ProgramDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const { t } = useTranslation()
  const { pathname } = location
  const program = programs.find((p) => p.slug === slug)

  // Unknown slug -> redirect to the programmes index.
  if (!program) return <Navigate to="/programs/" replace />

  const isLivelihood = slug === LIVELIHOOD_SLUG
  const srhrDetail = t('programs.srhrDetail', { returnObjects: true })
  const genericDetail = t('programs.genericDetail', { returnObjects: true })
  const secondChanceDetail = t('programs.secondChanceDetail', { returnObjects: true })
  const isSecondChance = slug === 'second-chance-education'
  const programTitle =
    slug === 'second-chance-education'
      ? t('programs.secondChanceTitle')
      : t(`programs.cards.${slug}.title`)
  const programSummary = t(`programs.cards.${slug}.summary`)
  if (isLivelihood && location.hash === '#our-approach') {
    return (
      <Navigate
        to={`/programs/${LIVELIHOOD_SLUG}/our-approach/`}
        replace
      />
    )
  }
  if (isLivelihood && location.hash === '#what-we-do') {
    return (
      <Navigate
        to={`/programs/${LIVELIHOOD_SLUG}/what-we-do/`}
        replace
      />
    )
  }

  // Programme-specific rich content.
  const programContent = {
    srhr: () => (
      <>
        <SplitPanelList
          className="split-panel-list--plain split-panel-list--srhr"
          image="/images/srhr-first-section.jpg"
          imageAlt={t('programs.srhrPanelImageAlt')}
          FallbackIcon={FaBookOpen}
          imageWidth={800}
          imageHeight={357}
        >
          <h2>{srhrDetail.title}</h2>
          {srhrDetail.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </SplitPanelList>

        <div className="srhr-how-works">
          <div className="srhr-how-works__text">
            <h2>{srhrDetail.howTitle}</h2>
            <p>{srhrDetail.howIntro}</p>
            <ul>
              {srhrDetail.approaches.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}: </strong>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <picture className="srhr-how-works__image">
            <source
              srcSet="/images/srhr-how-programme-works.webp"
              type="image/webp"
            />
            <img
              src="/images/srhr-how-programme-works.jpg"
              alt={t('programs.srhrPanelImageAlt')}
              width={571}
              height={1280}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

      </>
    ),
  }

  return (
    <>
      {!isLivelihood && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbListSchema(pathname, [
                t('breadcrumb.home', { defaultValue: 'Home' }),
                t('breadcrumb.programs', { defaultValue: 'Programs' }),
                programTitle,
              ]),
            ),
          }}
        />
      )}
      <ProgramHero
        title={programTitle}
        intro={
          isLivelihood
            ? t('programs.livelihood.heroIntro')
            : isSecondChance
              ? secondChanceDetail.intro
              : programSummary
        }
        image={PROGRAM_HERO_IMAGES[program.slug]}
        className={
          isLivelihood
            ? 'program-hero--livelihood'
            : isSecondChance
              ? 'program-hero--second-chance'
              : ''
        }
      />

      {isLivelihood ? (
        <article className="section container livelihood-content livelihood-program-page">
          <LivelihoodContent
            pathname={pathname}
            whyImage={program.whyImage}
            supportImage={program.supportImage}
            supportImageAlt={program.supportImageAlt}
            workingImage={program.workingImage}
          />
        </article>
      ) : (
        <section
          className={`section container prose${program.slug === 'srhr' ? ' srhr-programme-content' : ''}`}
        >
          {programContent[program.slug] ? (
            programContent[program.slug]()
          ) : isSecondChance ? (
            <>
              <div className="second-chance-what">
                <picture className="second-chance-what__image">
                  <source
                    srcSet="/images/second-chance-education-study.webp"
                    type="image/webp"
                  />
                  <img
                    src="/images/second-chance-education-study.jpg"
                    alt={secondChanceDetail.whatImageAlt}
                    width="800"
                    height="800"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="second-chance-what__copy">
                  {secondChanceDetail.whatParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <h2>{secondChanceDetail.approachTitle}</h2>
              <ul>
                {secondChanceDetail.approachPoints.map((point) => (
                  <li key={point.title}>
                    <strong>{point.title}: </strong>
                    {point.text}
                  </li>
                ))}
              </ul>

            </>
          ) : (
            <>
              <h2>{genericDetail.whatTitle}</h2>
              <p>{t('programs.genericDetail.coreIntro', { programTitle })}</p>

              <h2>{genericDetail.approachTitle}</h2>
              <ul>
                {genericDetail.approachPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </>
          )}

          {program.slug !== 'srhr' && !isSecondChance && (
            <>
              <h2>{genericDetail.getInvolvedTitle}</h2>
              <p>
                {genericDetail.getInvolvedIntro}{' '}
                <Link to="/get-involved/donate/">{genericDetail.actions.donate}</Link>,{' '}
                <Link to="/get-involved/volunteer/">{genericDetail.actions.volunteer}</Link>{' '}
                {genericDetail.actions.joiner}{' '}
                <Link to="/get-involved/partner/">{genericDetail.actions.partner}</Link>.
              </p>
            </>
          )}
        </section>
      )}
    </>
  )
}
