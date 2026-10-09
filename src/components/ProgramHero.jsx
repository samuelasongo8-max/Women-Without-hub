import { Link } from 'react-router-dom'
import './ProgramHero.css'

/**
 * ProgramHero — compact banner used by every /programs/:slug/ page.
 * Keeps the six programme pages visually identical.
 *
 * Props:
 *   title  (string)   page heading (rendered as <h1>)
 *   intro  (string)   short intro paragraph
 *   image  (string?)  background photo path from the public folder, e.g.
 *                     '/avocating health.jpg'. Names may contain spaces;
 *                     they are URL-encoded here (encodeURI).
 *
 * Breadcrumb is fixed for programme pages:  Home › Programs › <title>
 * (the current page title is not a link).
 *
 * BACKGROUND LOGIC (kept automatic):
 *   - If `image` is undefined, the banner uses a calm teal gradient
 *     (class .program-hero--plain).
 *   - As soon as an image path is passed, the photo appears behind a
 *     dark-teal overlay (class .program-hero--has-image) so the white
 *     text stays readable.
 */
export default function ProgramHero({ title, intro, image }) {
  const hasImage = Boolean(image)

  return (
    <section
      className={`program-hero ${
        hasImage ? 'program-hero--has-image' : 'program-hero--plain'
      }`}
      style={
        hasImage ? { backgroundImage: `url("${encodeURI(image)}")` } : undefined
      }
    >
      <div className="program-hero__inner">
        <nav className="program-hero__crumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/programs/">Programs</Link>
            </li>
            <li>
              <span aria-current="page">{title}</span>
            </li>
          </ol>
        </nav>

        <h1 className="program-hero__title">{title}</h1>
        {intro && <p className="program-hero__intro">{intro}</p>}
      </div>
    </section>
  )
}