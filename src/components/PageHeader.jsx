import Breadcrumbs from './Breadcrumbs.jsx'

/**
 * Consistent page header: breadcrumbs (communicates hierarchy to Google),
 * H1 and optional intro.
 */
export default function PageHeader({ title, intro }) {
  return (
    <section className="page-header">
      <Breadcrumbs />
      <div className="container">
        <h1>{title}</h1>
        {intro && <p className="page-intro">{intro}</p>}
      </div>
    </section>
  )
}
