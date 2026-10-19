import { Link } from 'react-router-dom'
import './WhyThisMatters.css'

/* Icons are inline SVGs so no extra icon library is required. */
const icons = {
  education: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  women: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M2.5 4.5h19a3 3 0 0 1 3 3v14.2a3 3 0 0 1-3 3H2.5a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z" />
      <path d="M5 9.5h14" />
    </svg>
  ),
}

const reasons = [
  {
    title: 'Girls miss out on education',
    text: 'Conflict, displacement and poverty interrupt schooling — and a pregnancy can end it completely. Remedial and second-chance education put learning back within reach.',
    icon: icons.education,
  },
  {
    title: 'Teenage mothers are left behind',
    text: 'Young mothers are often excluded from classrooms and training. Pathways back to learning, mentorship and skills restore their options.',
    icon: icons.women,
  },
  {
    title: 'Skills without opportunity lead nowhere',
    text: 'Digital and vocational skills only change lives when they connect to apprenticeships, market linkages and employment referrals.',
    icon: icons.skills,
  },
]

export default function WhyThisMatters() {
  return (
    <section className="p1-why">
      <div className="p1-why__inner">
        <h2 className="p1-why__title">Why This Matters</h2>
        <p className="p1-why__intro">
          AUVD is a refugee-led, community-based nonprofit organization in Kakuma
          Refugee Camp, Turkana County, Kenya. We empower refugees and vulnerable
          host communities through creative arts, inclusive education,
          psychosocial support, skills development, and community-led initiatives
          that build resilience, dignity, and opportunity.
        </p>

        <div className="p1-why__grid">
          {reasons.map((r) => (
            <article key={r.title} className="p1-why__card">
              <span className="p1-why__icon" aria-hidden="true">
                {r.icon}
              </span>
              <h3 className="p1-why__card-title">{r.title}</h3>
              <span className="p1-why__bar" aria-hidden="true"></span>
              <p className="p1-why__text">{r.text}</p>
            </article>
          ))}
        </div>

        {/* CTA — links only to a route that already exists in the target. */}
        <p className="p1-why__cta">
          <Link to="/impact/" className="p1-why__button">
            See the difference your support makes <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  )
}
