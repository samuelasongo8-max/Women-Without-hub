import { Link } from 'react-router-dom'
import { donateCta } from '../data/site.js'
import './OurStory.css'

/**
 * Home section: Our Story (auvd-story-).
 * Solid pink founder section shown right after the hero on /.
 */
export default function OurStorySection() {
  return (
    <section className="auvd-story">
      <div className="auvd-story__inner">
        <div className="auvd-story__left">
          <div className="auvd-story__media">
            <div className="auvd-person">
              <img src="/malua-lugazo-sticker.png" alt="MaLua Lugazo, Founder" />
            </div>
            <div className="auvd-story__bubble">
              <div className="auvd-story__bubble-inner">
                <p className="auvd-story__quote">
                  Every girl has the right to learn, grow and lead.
                </p>
                <p className="auvd-story__cite">— MaLua Lugazo, Founder</p>
              </div>
            </div>
          </div>

          <div className="auvd-story__blocks">
            <div className="auvd-story__block">
              <h2>From Kakuma to Hope</h2>
              <p>
                MaLua Lugazo knows Kakuma from the inside. As a Somali
                refugee growing up in the camp, she watched bright girls
                disappear from classrooms — early marriage, pregnancy,
                household labour and school costs closing doors one by one.
                She also saw what a single opportunity could do: a
                scholarship, a mentor, a safe room to study in.
              </p>
            </div>

            <div className="auvd-story__block">
              <h2>Why Women Without Borders Hub</h2>
              <p>
                MaLua founded Women Without Borders Hub so that no girl in
                Kakuma would have to fight for an education alone. Every
                programme is community-led — designed with the girls it
                serves — because the girls of Kakuma are not a problem to be
                solved but leaders to be equipped.
              </p>
            </div>
          </div>
        </div>

        <div className="auvd-story__right">
          <h2 className="auvd-story__heading">
            Our
            <br />
            Story
          </h2>
          <p className="auvd-story__intro">
            A Somali refugee who grew up in Kakuma, MaLua started the Hub
            with one belief: when a girl gets a real chance, she changes her
            family, her community and her future.
          </p>

          <ul className="auvd-story__links">
            <li>
              <Link to="/about/our-story/">
                Meet our founder <span aria-hidden="true">→</span>
              </Link>
            </li>
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
              <Link to="/get-involved/">
                Get Involved <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>

          <div className="auvd-story__actions">
            <Link
              className="auvd-story__btn auvd-story__btn--donate"
              to={donateCta.to}
            >
              {donateCta.label}
            </Link>
            <Link className="auvd-story__btn auvd-story__btn--contact" to="/contact/">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

