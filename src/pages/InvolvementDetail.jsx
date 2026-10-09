import { useParams, Link, Navigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { involvement } from '../data/site.js'
import './GetInvolved.css'

export default function InvolvementDetail() {
  const { slug } = useParams()
  const item = involvement.find((i) => i.slug === slug)

  if (!item) return <Navigate to="/get-involved/" replace />

  return (
    <div className="getinvolved-page">
      <PageHeader title={item.title} intro={item.summary} />

      <div className="getinvolved-split-list">
        <section className="getinvolved-split-row getinvolved-detail-card">
          <div className="getinvolved-split-panel">
            <div className="getinvolved-split-content">
              <h2 className="getinvolved-split-heading">How it works</h2>
              <span className="getinvolved-split-divider" aria-hidden="true" />
              <p className="getinvolved-split-body">
                Thank you for your interest in {item.title}. Complete the form
                or contact us directly and our team will get back to you within
                two working days.
              </p>
            </div>
          </div>

          <div className="getinvolved-split-panel getinvolved-detail-cta">
            <div className="getinvolved-split-content">
              <h2 className="getinvolved-split-heading">
                Ready to take the next step?
              </h2>
              <span className="getinvolved-split-divider" aria-hidden="true" />
              <p className="getinvolved-split-body">
                Reach out via our <Link to="/contact/">contact page</Link> or{' '}
                <Link to="/get-involved/donate/">make a donation</Link> today.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
