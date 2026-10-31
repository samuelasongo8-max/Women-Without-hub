import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import './Resources.css'

const resources = [
  {
    id: 'annualReport',
    type: 'report',
    // No file yet: `file: null` renders the "Will be updated soon" button.
    // Put a path here later (e.g. '/files/annual-impact-report-2025.pdf')
    // and this row automatically becomes a real <a href={file} download> link.
    file: null,
  },
  {
    id: 'menstrualGuide',
    type: 'guide',
    file: null,
  },
  {
    id: 'digitalCurriculum',
    type: 'toolkit',
    file: null,
  },
  {
    id: 'safeguardingPolicy',
    type: 'policy',
    file: null,
  },
  {
    id: 'srhrStudy',
    type: 'research',
    file: null,
  },
  {
    id: 'savingsGuide',
    type: 'guide',
    file: null,
  },
]

export default function Resources() {
  const { t } = useTranslation()
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
        title={t('resources.title')}
        intro={t('resources.intro')}
      />

      <section className="resources-list-wrap">
        <div className="resources-list-column">
          <ul className="resources-list">
            {resources.map((r, index) => (
              <li key={r.id} className="resources-list-row">
                <div className="resources-list-main">
                  <p className="resources-list-type">{t(`resources.types.${r.type}`)}</p>
                  <h2 className="resources-list-title">
                    {t(`resources.items.${r.id}.title`)}
                  </h2>
                  <p className="resources-list-desc">
                    {t(`resources.items.${r.id}.description`)}
                  </p>
                </div>
                <p className="resources-list-action" aria-live="polite">
                  {r.file ? (
                    <a href={r.file} download className="resources-list-download">
                      {t('resources.download')} →
                    </a>
                  ) : noticeIndex === index ? (
                    <span className="resources-list-notice">
                      {t('common.willBeUpdatedSoon')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="resources-list-download"
                      onClick={() => showNotice(index)}
                    >
                      {t('resources.download')} →
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
