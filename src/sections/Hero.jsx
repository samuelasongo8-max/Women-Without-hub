import { Link } from 'react-router-dom'
import { donateCta } from '../data/site.js'
import { SITE } from '../data/seo.js'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-area">
        {/* Decorative diagonal brush — top-left corner */}
        <svg className="hero-corner" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <path
            className="hero-fill-yellow"
            d="M-20 58C8 24 48-4 96-18c-14 34-34 64-54 94-20 18-44 8-62-18z"
          />
          <path
            className="hero-fill-coral"
            d="M32 132c40-46 92-82 152-98-16 36-36 66-66 96-26 24-62 24-86 2z"
          />
        </svg>

        {/* Decorative curved swoosh — bottom-right corner */}
        <svg className="hero-swoosh" viewBox="0 0 260 180" aria-hidden="true" focusable="false">
          <path className="hero-stroke-teal" d="M12 170C70 150 150 100 212 22" />
          <path className="hero-stroke-yellow" d="M42 177C102 161 176 116 236 48" />
          <path className="hero-stroke-coral" d="M74 180C132 169 196 131 253 74" />
        </svg>

        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title">
              Empowering
              <br />
              <span className="hero-h1-yellow">girls</span> &amp;{' '}
              <span className="hero-h1-coral">young women</span>
              <br />
              in Kakuma
            </h1>
            <p className="hero-lead">
              Creating opportunities for vulnerable girls, teenage mothers and
              young women through education, skills, mentorship, health and
              economic empowerment in Kakuma, Kenya.
            </p>
            <div className="hero-actions">
              <Link to={donateCta.to} className="hero-btn hero-btn-fill">
                {donateCta.label} <span aria-hidden="true">→</span>
              </Link>
              <Link to="/programs/" className="hero-btn hero-btn-outline">
                Our Programs
              </Link>
            </div>
          </div>

          <div className="hero-art">
            <span className="hero-brush hero-brush-a" aria-hidden="true" />
            <span className="hero-brush hero-brush-b" aria-hidden="true" />
            <span className="hero-brush hero-brush-c" aria-hidden="true" />
            <img
              className="hero-photo"
              src="/graduation-at-women-without-border.jpg"
              alt="Women proudly holding their graduation certificates"
            />
            <p className="hero-script">
              Real People.
              <br />
              Real Change.
            </p>
          </div>
        </div>
      </div>

      {/* STATS_STRIP */}
    </section>
  )
}
