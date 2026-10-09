import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { involvement } from '../data/site.js'
import './GetInvolved.css'

export default function GetInvolved() {
  return (
    <div className="getinvolved-page">
      <PageHeader
        title="Get Involved"
        intro="There are many ways to stand with women and girls — give, volunteer, mentor, join or partner."
      />

      <div className="getinvolved-split-list">
        {involvement.map((item, index) =>
          index === 0 ? (
            <article key={item.slug} className="getinvolved-split-row">
              <div className="getinvolved-split-media">
                <img
                  className="getinvolved-split-img"
                  src="/avocating%20health.jpg"
                  alt={`${item.title} — Women Without Borders Hub`}
                  loading="lazy"
                />
                <span className="getinvolved-split-fade" aria-hidden="true" />
              </div>

              <div className="getinvolved-split-panel">
                <div className="getinvolved-split-content">
                  <h2 className="getinvolved-split-heading">{item.title}</h2>
                  <span
                    className="getinvolved-split-divider"
                    aria-hidden="true"
                  />
                  <p className="getinvolved-split-body">{item.summary}</p>
                  <Link
                    to={`/get-involved/${item.slug}/`}
                    className="getinvolved-split-btn"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </article>
          ) : null,
        )}

        <div className="getinvolved-split-grid">
          {involvement.slice(1).map((item) => (
            <article
              key={item.slug}
              className="getinvolved-split-row getinvolved-split-row--card"
            >
              <div className="getinvolved-split-panel">
                <div className="getinvolved-split-content">
                  <h2 className="getinvolved-split-heading">{item.title}</h2>
                  <span
                    className="getinvolved-split-divider"
                    aria-hidden="true"
                  />
                  <p className="getinvolved-split-body">{item.summary}</p>
                  <Link
                    to={`/get-involved/${item.slug}/`}
                    className="getinvolved-split-btn"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
