import { Link } from 'react-router-dom'
import { donateCta } from '../data/site.js'
import './Donate.css'

export default function DonateSection() {
  return (
    <section className="section donate-banner">
      <div className="container">
        <h2>Stand with girls &amp; young women in Kakuma</h2>
        <p>
          Every donation funds education, literacy, skills, mentorship, health
          and dignity — directly in refugee and host communities in Kakuma,
          Kenya.
        </p>
        <div className="donate-actions">
          <Link to={donateCta.to} className="btn btn-donate btn-lg">
            {donateCta.label}
          </Link>
          <Link to="/get-involved/partner/" className="btn btn-outline btn-lg">
            Partner with us ||
          </Link>
        </div>
      </div>
    </section>
  )
}
