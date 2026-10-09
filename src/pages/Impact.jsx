import { Link } from 'react-router-dom'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './Impact.css'

const stats = [
 { number: '500+', label: 'Women & girls reached' },
  { number: '45', label: 'Communities served' },
  { number: '150', label: 'Volunteer mentors' },
  { number: '89%', label: 'Programme completion rate' },
]

export default function Impact() {
  return (
    <>
      {/* Hero replaces the shared PageHeader on this page only; the
          component itself stays untouched for every other page. */}
      <section className="impact-hero">
        <div className="impact-hero__top">
          <h1 className="impact-hero__title">Impact</h1>
          <p className="impact-hero__subtitle">
            We measure what matters and publish it. Here is what your
            support has achieved.
          </p>
        </div>

        {/* Stats band, pinned to the bottom of the hero. */}
        <div className="impact-hero__band">
          <div className="impact-hero__grid">
            {stats.map((s) => (
              <div key={s.label} className="impact-stat">
                <span className="impact-stat__number">{s.number}</span>
                <span className="impact-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="impact-body">
        {/* "Impacts" sidebar (All) + full card grid. */}
        <ImpactsLayout />

     

       

        {/* Image (left, full-bleed) + overlapping teal card — the
            redesigned "How we measure" block. measure-* classes are
            scoped in Impact.css so they can't clash with other styles. */}
        <section className="measure">
          <img
            className="measure__image"
            src="/Measure impact.png"
            alt="Women and girls taking part in a programme in Kakuma"
          />

          <div className="measure__card">
            <h2 className="measure__title">How we measure</h2>
            <p className="measure__text">
              Every programme tracks participation, completion and outcome
              indicators, verified through follow-up surveys at 3, 6 and 12
              months. Annual reports are published in{' '}
              <Link to="/resources/" className="measure__link">Resources</Link>.
            </p>

            <h3 className="measure__subtitle">Help us multiply this impact</h3>
            <p className="measure__text">
              <Link to="/get-involved/donate/" className="measure__donate">Donate</Link>
              {', '}
              <Link to="/get-involved/volunteer/" className="measure__link">volunteer</Link>{' '}
              or{' '}
              <Link to="/get-involved/partner/" className="measure__link">partner</Link>{' '}
              with us.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
