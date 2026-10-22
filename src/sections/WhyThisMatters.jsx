import { Link } from 'react-router-dom'
import './WhyThisMatters.css'

const reasons = [
  {
    title: 'Girls miss out on education',
    text: 'Conflict, displacement and poverty interrupt schooling — and a pregnancy can end it completely. Remedial and second-chance education put learning back within reach.',
  },
  {
    title: 'Teenage mothers are left behind',
    text: 'Young mothers are often excluded from classrooms and training. Pathways back to learning, mentorship and skills restore their options.',
  },
  {
    title: 'Skills without opportunity lead nowhere',
    text: 'Digital and vocational skills only change lives when they connect to apprenticeships, market linkages and employment referrals.',
  },
]

export default function WhyThisMatters() {
  return (
    <section className="section why-matters">
      <div className="container">
        <h2 className="section-title">Why This Matters</h2>
        <p>
          AUVD is a refugee-led, community-based nonprofit organization in Kakuma
          Refugee Camp, Turkana County, Kenya. We empower refugees and vulnerable
          host communities through creative arts, inclusive education,
          psychosocial support, skills development, and community-led initiatives
          that build resilience, dignity, and opportunity.
        </p>

        <div className="why-grid">
          {reasons.map((r) => (
            <article key={r.title} className="why-card">
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
        </div>

        <p className="section-cta">
          <Link to="/impact/">See the difference your support makes →</Link>
        </p>
      </div>
    </section>
  )
}
