import { useParams, Link, Navigate } from 'react-router-dom'
import ProgramHero from '../components/ProgramHero.jsx'
import { programImages } from '../data/programImages.js'
import { programs } from '../data/site.js'

// Optional background photo per programme slug (files live in /public).
// File names contain spaces, so they are URL-encoded inside ProgramHero.
// Programmes without an entry use a plain teal gradient banner.
const PROGRAM_HERO_IMAGES = {
  'education-literacy': '/avocating health.jpg',
  'digital-technical-skills': '/Digital & Technical Skills.jpg',
  'mentorship-life-skills': '/women-hub-training.png',
  'health-menstrual-dignity': '/avocating health.jpg',
  srhr: '/Sexual & Reproductive Health and Rights (SRHR).jpg',
  'livelihood-economic-empowerment': '/graduation-at-women-without-border.jpg',
}

export default function ProgramDetail() {
  const { slug } = useParams()
  const program = programs.find((p) => p.slug === slug)

  // Unknown slug -> redirect to the programmes index.
  if (!program) return <Navigate to='/programs/' replace />

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
          sensitive, inclusive, and appropriate to participants' ages. We encourage
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
        title={program.title}
        intro={program.summary}
        image={PROGRAM_HERO_IMAGES[program.slug]}
      />

      <section className='section container prose'>
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
          <Link to='/get-involved/donate/'>donating</Link>,{' '}
          <Link to='/get-involved/volunteer/'>volunteering</Link> or{' '}
          <Link to='/get-involved/partner/'>partnering</Link> with us.
        </p>
      </section>
    </>
  )
}
