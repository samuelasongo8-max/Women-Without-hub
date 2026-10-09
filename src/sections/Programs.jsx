import { Link } from 'react-router-dom'
import './Programs.css'

// Programme strip palette: teal / yellow / coral.
const T = '#1e8e96'
const Y = '#f6b95c'
const C = '#ef6f52'

// The six programmes rendered as a coloured-icon strip.
// Relative routes only — never a full http://localhost URL.
const programs = [
  {
    title: 'Education & Literacy',
    to: '/programs/education-literacy/',
    text: 'Scholarships, literacy circles, remedial and second-chance education that keep girls in school and open educational opportunities for vulnerable girls in Kakuma.',
    icon: (
      <>
        <path d="M4 10c9-3 15-1 20 4v26c-5-5-11-7-20-4z" fill={T} />
        <path d="M44 10c-9-3-15-1-20 4v26c5-5 11-7 20-4z" fill={C} />
      </>
    ),
  },
  {
    title: 'Digital & Technical Skills',
    to: '/programs/digital-technical-skills/',
    text: 'Computer literacy and digital skills bootcamps alongside vocational training in tailoring, fashion, beauty and hairdressing for young women.',
    icon: (
      <>
        <rect x="8" y="9" width="32" height="23" rx="3" fill={T} />
        <path d="M3 36h42l-3 5H6z" fill={Y} />
      </>
    ),
  },
  {
    title: 'Mentorship & Life Skills',
    to: '/programs/mentorship-life-skills/',
    text: 'Mentorship, life skills, leadership, career guidance, goal setting and financial literacy that build confidence and self-reliance.',
    icon: (
      <>
        <circle cx="17" cy="13" r="7" fill={T} />
        <circle cx="34" cy="17" r="6" fill={C} />
        <path d="M5 42c0-12 6-17 12-17s12 5 12 17z" fill={T} />
        <path d="M27 42c0-8 3-12 7-12s9 4 9 12z" fill={Y} />
      </>
    ),
  },
  {
    title: 'Health & Menstrual Dignity',
    to: '/programs/health-menstrual-dignity/',
    text: 'Menstrual health education, menstrual products, health awareness and health referrals so no one misses school or work.',
    icon: (
      <path
        d="M24 4C14 18 10 24 10 31a14 14 0 0 0 28 0c0-7-4-13-14-27z"
        fill={C}
      />
    ),
  },
  {
    title: 'Sexual & Reproductive Health and Rights (SRHR)',
    to: '/programs/srhr/',
    text: 'Age-appropriate, culturally sensitive SRHR education, peer education and community awareness built on respect and choice.',
    icon: (
      <>
        <path
          d="M24 42C8 30 6 22 6 16a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 6-2 14-18 26z"
          fill={T}
        />
        <circle cx="36" cy="10" r="5" fill={Y} />
      </>
    ),
  },
  {
    title: 'Livelihood & Economic Empowerment',
    to: '/programs/livelihood-economic-empowerment/',
    text: 'Entrepreneurship, business mentorship, apprenticeships, market linkages and employment referrals for women’s economic empowerment.',
    icon: (
      <>
        <path d="M24 4c7 5 7 14 0 19-7-5-7-14 0-19z" fill={C} />
        <path
          d="M24 26c-2-7-9-9-16-7 0 7 7 11 16 7zM24 26c2-7 9-9 16-7 0 7-7 11-16 7z"
          fill={Y}
        />
        <path d="M24 24v18" stroke={T} strokeWidth="3" />
        <path d="M14 43h20l-3-5H17z" fill={T} />
      </>
    ),
  },
]

export default function Programs() {
  return (
    <section className="home-programs">
      <div className="container">
        <h2>Our Programs</h2>
        <p className="section-intro">
          Six programme areas addressing the barriers facing girls and young
          women in Kakuma — from the classroom to the marketplace.
        </p>

        <div className="home-programs-grid">
          {programs.map(({ title, to, text, icon }) => (
            <article key={to} className="home-program">
              <svg
                className="home-program-icon"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                {icon}
              </svg>
              <h3>
                <Link to={to}>{title}</Link>
              </h3>
              <p>{text}</p>
              <Link to={to} className="home-program-link">
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
