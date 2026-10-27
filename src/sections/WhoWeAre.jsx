import { Link } from 'react-router-dom'
import { ORG_NAME } from '../config/site.js'
import { SITE } from '../data/seo.js'
import './WhoWeAre.css'

export default function WhoWeAre() {
  return (
    <section className="who-we-are">
      <div className="container who-grid">
        <div className="who-art">
          <div className="who-photo-wrap" aria-hidden="true">
            <span className="who-stroke who-stroke--1" />
            <span className="who-stroke who-stroke--2" />
            <span className="who-stroke who-stroke--3" />
            <span className="who-stroke who-stroke--4" />
            <img
              className="who-photo"
              src="/images/literacy-program-at-women-without-hub.jpg"
              alt={`Girls sitting in a literacy class at ${ORG_NAME}`}
              loading="lazy"
            />
          </div>
        </div>

        <div className="who-copy">
          <p className="who-eyebrow">About us</p>
          <h2>Who We Are</h2>
          <p>
            {SITE.name} is a community-led organization in{' '}
            <strong>{SITE.location}</strong>, working with refugee and host
            communities to remove barriers to education and opportunity for
            vulnerable girls, teenage mothers and young women.
          </p>
          <p>
            Through educational support, literacy, mentorship, health support,
            practical skills and pathways toward economic empowerment, we help
            young women learn, build confidence and secure an independent
            future.
          </p>
          <Link className="who-btn" to="/about/">
            About our organization →
          </Link>

          <h3>Our core values</h3>
          <ul className="who-values">
            {SITE.values.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
