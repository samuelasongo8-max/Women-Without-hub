import { Link } from 'react-router-dom'
import { donateCta, socialLinks } from '../data/site.js'
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

            {/* Social icon row — sits directly below the two buttons, above the
                photo overlay (z-index handled in Hero.css). */}
            <div className="hero-social-icons">
              {/* Facebook — solid circle #1877F2 with white "f" logo */}
              <a
                className="hero-social-link hero-social-facebook"
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Women Without Borders Hub on Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 320 512" fill="#fff" aria-hidden="true" focusable="false">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297.6V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>

              {/* LinkedIn — solid circle #0A66C2 with white "in" logo */}
              <a
                className="hero-social-link hero-social-linkedin"
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Women Without Borders Hub on LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 448 512" fill="#fff" aria-hidden="true" focusable="false">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 149.1V448z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-art">
            <span className="hero-brush hero-brush-a" aria-hidden="true" />
            <span className="hero-brush hero-brush-b" aria-hidden="true" />
            <span className="hero-brush hero-brush-c" aria-hidden="true" />
            <img
              className="hero-photo"
              src="/images/graduation-at-women-without-border.jpg"
              alt="Women proudly holding their graduation certificates"
              width="800"
              height="600"
              loading="eager"
              decoding="async"
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
