import { useRef, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import './Resources.css'

const resources = [
  {
    type: 'Report',
    title: 'Annual Impact Report 2025',
    description: 'Outcomes, finances and stories from every programme area.',
    // No file yet: `file: null` renders the "Will be updated soon" button.
    // Put a path here later (e.g. '/files/annual-impact-report-2025.pdf')
    // and this row automatically becomes a real <a href={file} download> link.
    file: null,
  },
  {
    type: 'Guide',
    title: 'Menstrual Dignity Implementation Guide',
    description: 'Practical guidance for schools and workplaces on WASH and supplies.',
    file: null,
  },
  {
    type: 'Toolkit',
    title: 'Digital Skills Curriculum',
    description: 'Open curriculum for community-led digital literacy bootcamps.',
    file: null,
  },
  {
    type: 'Policy',
    title: 'Safeguarding & Child Protection Policy',
    description: 'Our standards for keeping participants safe.',
    file: null,
  },
  {
    type: 'Research',
    title: 'SRHR Knowledge, Attitudes & Practices Study',
    description: 'Baseline research across 12 districts.',
    file: null,
  },
  {
    type: 'Guide',
    title: 'Starting a Savings Group',
    description: 'A step-by-step handbook for forming and running a savings group.',
    file: null,
  },
]

export default function Resources() {
  // Index of the row showing "Will be updated soon" (only one at a time).
  const [noticeIndex, setNoticeIndex] = useState(null)
  const timerRef = useRef(null)

  const showNotice = (index) => {
    setNoticeIndex(index)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNoticeIndex(null), 4000)
  }

  return (
    <div className="resources-page">
      <PageHeader
        title="Resources"
        intro="Reports, toolkits and guides from our work — free to download and reuse."
      />

      <section className="resources-list-wrap">
        <div className="resources-list-column">
          <ul className="resources-list">
            {resources.map((r, index) => (
              <li key={r.title} className="resources-list-row">
                <div className="resources-list-main">
                  <p className="resources-list-type">{r.type}</p>
                  <h2 className="resources-list-title">{r.title}</h2>
                  <p className="resources-list-desc">{r.description}</p>
                </div>
                <p className="resources-list-action" aria-live="polite">
                  {r.file ? (
                    <a href={r.file} download className="resources-list-download">
                      Download →
                    </a>
                  ) : noticeIndex === index ? (
                    <span className="resources-list-notice">Will be updated soon</span>
                  ) : (
                    <button
                      type="button"
                      className="resources-list-download"
                      onClick={() => showNotice(index)}
                    >
                      Download →
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
