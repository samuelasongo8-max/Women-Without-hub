import PageHeader from '../components/PageHeader.jsx'
import ImpactsLayout from '../components/ImpactsLayout.jsx'
import './ImpactSectionPages.css'

/** /impact/report/ — notice instead of cards until reports are uploaded. */
export default function Report() {
  return (
    <div className="impact-section-page">
      <PageHeader
        title="Report"
        intro="Outcomes, reach and how we measure change across our programmes."
      />
      <ImpactsLayout
        type="Report"
        notice="Our report is being prepared and will be uploaded soon."
      />
    </div>
  )
}