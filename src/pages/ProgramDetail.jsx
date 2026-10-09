import { useParams, Link, Navigate } from 'react-router-dom'
import ProgramHero from '../components/ProgramHero.jsx'
import { programs } from '../data/site.js'

// Optional background photo per programme slug (files live in /public).
// File names contain spaces, so they are URL-encoded inside ProgramHero.
// Programmes without an entry use a plain teal gradient banner.
const PROGRAM_HERO_IMAGES = {
  'education-literacy': '/avocating health.jpg',
  'livelihood-economic-empowerment': '/Get Involve.png',
  'mentorship-life-skills': '/Impact at Women without border.png',
}

export default function ProgramDetail() {
  const { slug } = useParams()
  const program = programs.find((p) => p.slug === slug)

  // Unknown slug -> redirect to the programmes index.
  if (!program) return <Navigate to="/programs/" replace />

  return (
    <>
      <ProgramHero
        title={program.title}
        intro={program.summary}
        image={PROGRAM_HERO_IMAGES[program.slug]}
      />

      <section className="section container prose">
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

        <h2>Get involved</h2>
        <p>
          You can support this work by{' '}
          <Link to="/get-involved/donate/">donating</Link>,{' '}
          <Link to="/get-involved/volunteer/">volunteering</Link> or{' '}
          <Link to="/get-involved/partner/">partnering</Link> with us.
        </p>
      </section>
    </>
  )
}
