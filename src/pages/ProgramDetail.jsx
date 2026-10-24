import { useParams, Link, Navigate, useLocation } from 'react-router-dom'
import ProgramHero from '../components/ProgramHero.jsx'
import { programImages } from '../data/programImages.js'
import { programs } from '../data/site.js'
import { breadcrumbListSchema } from '../data/seo.js'
import livelihoodMarkdown from '../content/livelihood-economic-empowerment.en.md?raw'
import './ProgramDetail.css'

const LIVELIHOOD_SLUG = 'livelihood-economic-empowerment'

// Optional optimized desktop/mobile hero photos per programme slug.
// Programmes without an entry use a plain teal gradient banner.
const PROGRAM_HERO_IMAGES = {
  'education-literacy': {
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
    desktop: '/images/program-livelihood-banner-desktop',
    mobile: '/images/program-livelihood-banner-mobile',
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
    const approachItem = paragraph.match(/^\*\*(.+?):\*\*\s*(.+)$/)

    if (approachItem && section?.title === 'Our Approach') {
      section.items.push({
        title: approachItem[1],
        paragraphs: [approachItem[2].trim()],
      })
    } else if (!section) {
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
        items: [],
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
  'our-approach',
  'who-we-support',
  'working-together',
]

function LivelihoodContent({ pathname }) {
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

      <nav className="livelihood-toc" aria-label="On this page">
        <p className="livelihood-toc__label">On this page</p>
        <ul>
          <li>
            <Link
              className="livelihood-toc__page-link"
              to="/programs/livelihood-economic-empowerment/what-we-do/"
            >
              What We Do <span aria-hidden="true">↗</span>
            </Link>
          </li>
          {sections.map((section, index) => (
            <li key={section.title}>
              <a href={`#${LIVELIHOOD_SECTION_IDS[index]}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((section, index) => (
        <section
          className="livelihood-section"
          id={LIVELIHOOD_SECTION_IDS[index]}
          key={section.title}
        >
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {section.title === 'Our Approach' && (
            <div className="livelihood-approach-grid">
              {section.items.map((approachItem) => (
                <article className="livelihood-approach-card" key={approachItem.title}>
                  <h3>{approachItem.title}</h3>
                  <p>{approachItem.paragraphs[0]}</p>
                </article>
              ))}
            </div>
          )}

          {section.title === 'Working Together to Create Opportunities' && (
            <Link className="livelihood-partner-link" to="/contact/">
              Partner with us
            </Link>
          )}
        </section>
      ))}
    </>
  )
}

export default function ProgramDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const { pathname } = location
  const program = programs.find((p) => p.slug === slug)

  // Unknown slug -> redirect to the programmes index.
  if (!program) return <Navigate to="/programs/" replace />

  const isLivelihood = slug === LIVELIHOOD_SLUG
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
        <h2>Promoting Knowledge, Dignity, and Informed Choices</h2>
        <p>
          At Women Without Borders Hub, we believe that every girl and young woman
          deserves access to reliable information about her sexual and
          reproductive health in a safe, respectful, and supportive environment.
        </p>
        <p>
          In Kakuma Refugee Camp, access to accurate health information, stigma,
          cultural barriers, and limited awareness can make it difficult for some
          young people to discuss sexual and reproductive health openly. Our SRHR
          programme promotes age-appropriate education, peer learning, and community
          awareness to help address these challenges.
        </p>

        <h2>How Our Programme Works</h2>
        <p>
          We create opportunities for girls and young women to learn, ask
          questions, share knowledge, and develop the confidence to make informed
          decisions about their health and well-being.
        </p>
        <ul>
          <li>
            <strong>SRHR Education:</strong> Sharing accurate, age-appropriate
            information about sexual and reproductive health.
          </li>
          <li>
            <strong>Peer Education:</strong> Encouraging participants to learn
            from one another and share reliable information with their peers.
          </li>
          <li>
            <strong>Community Awareness:</strong> Promoting respectful conversations
            that challenge stigma and misconceptions.
          </li>
          <li>
            <strong>Dignity and Respect:</strong> Creating a supportive learning
            environment that values privacy, personal boundaries, and individual
            choices.
          </li>
          <li>
            <strong>Health Information and Referrals:</strong> Where appropriate,
            helping participants identify reliable health information and available
            professional services.
          </li>
        </ul>

        <h2>Our Approach</h2>
        <p>
          We recognise the cultural diversity and lived experiences of refugee and
          host communities in Kakuma. Our approach is respectful, culturally
          sensitive, inclusive, and appropriate to participants&apos; ages. We encourage
          open dialogue without discrimination, shame, or judgment.
        </p>

        <h2>Our Goal</h2>
        <p>
          Our goal is to empower girls and young women with the knowledge and
          confidence to protect their well-being, understand their rights, seek
          reliable health information, and make informed decisions about their
          future.
        </p>
        <p>
          <em>
            Knowledge builds confidence. Respect protects dignity. Informed choices
            support healthier futures.
          </em>
        </p>
      </>
    ),
  }

  return (
    <>
      <ProgramHero
        title={isLivelihood ? LIVELIHOOD_CONTENT.title : program.title}
        intro={isLivelihood ? LIVELIHOOD_CONTENT.subtitle : program.summary}
        image={PROGRAM_HERO_IMAGES[program.slug]}
      />

      {isLivelihood ? (
        <article className="section container livelihood-content">
          <LivelihoodContent pathname={pathname} />
        </article>
      ) : (
        <section className="section container prose">
          {programContent[program.slug] ? (
            programContent[program.slug]()
          ) : (
            <>
              <h2>What we do</h2>
              <p>
                {program.title} is one of our core programme areas. We work alongside
                women and girls, communities, educators and local partners to remove
                the barriers that hold people back — and to build skills, confidence
                and opportunity that last a lifetime.
              </p>

              <h2>Our approach</h2>
              <ul>
                <li>Community-led design, so solutions fit real lives</li>
                <li>Safe, inclusive spaces with safeguarding at the centre</li>
                <li>Measurable outcomes, reported transparently</li>
                <li>Partnerships with schools, clinics, employers and local groups</li>
              </ul>
            </>
          )}

          <h2>Get involved</h2>
          <p>
            You can support this work by{' '}
            <Link to="/get-involved/donate/">donating</Link>,{' '}
            <Link to="/get-involved/volunteer/">volunteering</Link> or{' '}
            <Link to="/get-involved/partner/">partnering</Link> with us.
          </p>
        </section>
      )}
    </>
  )
}
