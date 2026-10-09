import { Link } from 'react-router-dom'
import { donateCta } from '../data/site.js'
import './OurStory.css'

/**
 * Our Story - the founder story of Women Without Borders Hub.
 * Sub-page of About at /about/our-story/.
 * Layout: teal banner -> solid pink founder section (auvd-founder).
 */
export default function OurStory() {
  return (
    <article className="story-page">
      <header
        className="story-banner auvd-story-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.7)), url('/Kakuma.jpg')",
        }}
      >
        <div className="auvd-story-overlay" aria-hidden="true" />
        <div className="container auvd-story-content">
          <h1 className="story-title">
            MaLua Lugazo: Building Hope for Girls in Kakuma
          </h1>
          <p className="story-lead">
            MaLua Lugazo is a Somali refugee living in Kakuma Refugee Camp
            who founded Women Without Borders Hub so that every girl and
            young woman has a chance to learn, grow and lead.
          </p>
        </div>
      </header>

      <section className="auvd-founder">
        <div className="auvd-founder__inner">
          <div className="auvd-founder__left">
            <div className="auvd-founder__media">
              <div className="auvd-person">
                <div className="auvd-person__shape" aria-hidden="true" />
                <img
                  className="auvd-person__img"
                  src="/Malua%20director.png"
                  alt="MaLua Lugazo, Director of Women Without Borders Hub"
                  loading="lazy"
                />
              </div>
              <div className="auvd-founder__bubble">
                <div className="auvd-founder__bubble-inner">
                  <p className="auvd-founder__quote">
                    Every girl has the right to learn, grow and lead.
                  </p>
                  <p className="auvd-founder__cite">
                    - MaLua Lugazo, Founder
                  </p>
                </div>
              </div>
            </div>

            <div className="auvd-founder__blocks">
              <div className="auvd-founder__block">
                <h2>From Kakuma to Hope</h2>
                <p>
                  MaLua Lugazo knows Kakuma from the inside. As a Somali
                  refugee growing up in the camp, she watched bright girls
                  disappear from classrooms - early marriage, pregnancy,
                  household labour and school costs closing doors one by
                  one. She also saw what a single opportunity could do: a
                  scholarship, a mentor, a safe room to study in. That
                  contrast - between what girls in Kakuma are denied and
                  what they become when someone believes in them - is where
                  Women Without Borders Hub began.
                </p>
              </div>

              <div className="auvd-founder__block">
                <h2>Why Women Without Borders Hub</h2>
                <p>
                  MaLua founded Women Without Borders Hub so that no girl in
                  Kakuma would have to fight for an education alone. The Hub
                  brings refugee and host-community girls together in one
                  movement: education and literacy, digital and vocational
                  skills, mentorship, menstrual dignity, health and pathways
                  into work. Every programme is community-led - designed with
                  the girls it serves - because the girls of Kakuma are not a
                  problem to be solved but leaders to be equipped.
                </p>
              </div>
            </div>
          </div>

          <div className="auvd-founder__right">
            <h2 className="auvd-founder__heading">
              What
              <br />
              we do
            </h2>
            <p className="auvd-founder__intro">
              Today the Hub walks with vulnerable girls, teenage mothers and
              young women across Kakuma - from the classroom to the
              marketplace. Explore our programmes, see the change your
              support creates, and join the story:
            </p>

            <ul className="auvd-founder__links">
              <li>
                <Link to="/programs/">
                  Our Programs <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link to="/impact/">
                  Our Impact <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link to="/updates/">
                  Community Updates &amp; Stories <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link to="/get-involved/">
                  Get Involved <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>

            <div className="auvd-founder__actions">
              <Link
                className="auvd-founder__btn auvd-founder__btn--donate"
                to={donateCta.to}
              >
                {donateCta.label}
              </Link>
              <Link
                className="auvd-founder__btn auvd-founder__btn--contact"
                to="/contact/"
              >
                Contact Us
              </Link>
            </div>

            {/* Decorative photo — desktop only (hidden on tablet/phone via CSS). */}
            <img
              className="auvd-founder__aside-img"
              src="/women Hub7.png"
              alt="Women of Women Without Borders Hub in Kakuma"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </article>
  )
}
