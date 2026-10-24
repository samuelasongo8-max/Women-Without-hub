import { Link } from 'react-router-dom'
import './GetInvolved.css'

/**
 * Home section: Get Involved (auvd-).
 * Split banner — sharp photo on the left half, the same photo washed
 * out behind the text on the right half. Leads to /get-involved/.
 */
export default function GetInvolvedSection() {
  return (
    <section className="auvd-involved">
      <div className="auvd-involved__photo">
        <img
          className="auvd-involved__img"
          src="/images/women-hub-training.png"
          alt="Women Without Borders Hub training and mentorship session"
          loading="lazy"
          decoding="async"
          width="800"
          height="600"
        />
      </div>

      <div className="auvd-involved__wash" aria-hidden="true" />

      <div className="auvd-involved__panel">
        <div className="auvd-involved__text">
          <h2 className="auvd-involved__heading">Get Involved</h2>
          <span className="auvd-involved__divider" aria-hidden="true" />
          <p className="auvd-involved__sub">There is a place for everyone.</p>
          <p className="auvd-involved__body">
            Donors, development organizations, NGOs, community partners,
            schools, training institutions, health partners, volunteers,
            mentors and members. Explore all ways to get involved.
          </p>
          <Link to="/get-involved/" className="auvd-involved__btn">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}
