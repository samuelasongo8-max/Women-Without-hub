import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { SITE } from '../data/seo.js'
import './About.css'

export default function About() {
  return (
    <>
      {/* Top About banner — background image scoped to this section only */}
      <section className="auvd-about-banner" aria-labelledby="about-title">
        <div className="auvd-about-overlay" aria-hidden="true" />
        <div className="container auvd-about-content">
          <Breadcrumbs />
          <h1 id="about-title" className="auvd-about-title">
            About
          </h1>
          <p className="auvd-about-text">
            Women Without Borders Hub is a community-led organization in
            Kakuma, Turkana County, Kenya, creating opportunities for vulnerable
            girls, teenage mothers and young women.
          </p>
        </div>
      </section>

      <section className="section container prose">
        <h2>Who we are</h2>
        <p>
          {SITE.name} works with refugee and host communities in{' '}
          {SITE.location}, removing the barriers that keep vulnerable girls,
          teenage mothers and young women from learning, income and a
          self-reliant future.
        </p>

        <div className="auvd-about-mv-row">
          <div className="auvd-about-mission-box">
            <span className="auvd-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <h2 className="auvd-about-mission-title">Our mission</h2>
            <p className="auvd-about-mission-text">{SITE.mission}</p>
          </div>

          <div className="auvd-about-vision-box">
            <span className="auvd-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <h2 className="auvd-about-vision-title">Our vision</h2>
            <p className="auvd-about-vision-text vision-statement">
              {SITE.vision}
            </p>
          </div>
        </div>
      </section>

      <section className="about-info" aria-label="About details">
        <div className="about-info-column">
          <div className="about-info-row">
            <h2 className="about-info-heading">Who we serve</h2>
            <ul className="about-info-serve">
              {SITE.primaryAudiences.map((a) => (
                <li key={a}>{a}</li>
              ))}
              {SITE.communities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="about-info-row">
            <h2 className="about-info-heading">Our core values</h2>
            <ul className="about-info-values">
              {SITE.values.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>

          <div className="about-info-row">
            <h2 className="about-info-heading">Where we work</h2>
            <div className="about-info-work">
              <address className="about-info-address">
                <strong>{SITE.name}</strong>
                <br />
                {SITE.address.streetAddress}
                <br />
                {SITE.address.addressRegion}, {SITE.address.addressCountry}
                <br />
                {SITE.postalAddress}
              </address>
              <p className="about-info-partners">
                We partner with schools, training institutions, health
                providers, NGOs, development organizations, donors and
                private-sector partners — adapting each programme to local
                needs while holding consistent standards for quality and
                safeguarding.
              </p>
            </div>
          </div>

          <div className="about-info-row">
            <h2 className="about-info-heading">Get to know us better</h2>
            <p className="about-info-more">
              Explore our <Link to="/programs/">programs</Link>, read our{' '}
              <Link to="/impact/">impact</Link> or{' '}
              <Link to="/get-involved/">get involved</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
