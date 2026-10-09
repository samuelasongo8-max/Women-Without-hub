import PageHeader from '../components/PageHeader.jsx'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './ImpactSectionPages.css'

/**
 * /impact/blogs/ — page shell only (header + Impacts sidebar).
 * The blog cards were removed, so `empty` renders no card grid.
 */
export default function Blogs() {
  return (
    <div className="impact-section-page">
      <PageHeader
        title="Blogs"
        intro="Reflections from our team, mentors and the women and girls we work with."
      />
      <ImpactsLayout empty />
    </div>
  )
}