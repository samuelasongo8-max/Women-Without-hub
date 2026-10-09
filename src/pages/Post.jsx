import PageHeader from '../components/PageHeader.jsx'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './ImpactSectionPages.css'

/** /impact/post/ — Post cards only. */
export default function Post() {
  return (
    <div className="impact-section-page">
      <PageHeader
        title="Post"
        intro="Stories, announcements and highlights from our work in Kakuma."
      />
      <ImpactsLayout type="Post" />
    </div>
  )
}