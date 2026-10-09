import { Link } from 'react-router-dom'
import './Impact.css'

const stats = [
  { number: '500+', label: 'Women & girls reached' },
  { number: '45', label: 'Communities served' },
  { number: '150', label: 'Volunteer mentors' },
  { number: '89%', label: 'Programme completion rate' },
]

export default function ImpactSection() {
  return (
    <section className="auvd-impact">
      <div className="auvd-impact-inner">
        <div className="auvd-impact__photo" aria-hidden="true">
          <span className="auvd-impact__stroke auvd-impact__stroke--1" />
          <span className="auvd-impact__stroke auvd-impact__stroke--2" />
          <span className="auvd-impact__stroke auvd-impact__stroke--3" />
          <span className="auvd-impact__stroke auvd-impact__stroke--4" />
          <img
            className="auvd-impact__img"
            src="/Impact%20at%20Women%20without%20border.png"
            alt="Women Hub training session"
            loading="lazy"
          />
        </div>
        <div className="auvd-impact-text">
          <h2>Our Impact</h2>
          <p>
            Measured outcomes across our programmes with refugee and host
            communities in Kakuma.
          </p>
          <Link to="/impact/" className="auvd-impact-btn">
            <span>See our impact</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <dl className="auvd-impact-stats">
          {stats.map((s) => (
            <div key={s.label} className="auvd-stat">
              <dt>{s.label}</dt>
              <dd>{s.number}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
