import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ORG_NAME } from '../config/site.js'
import Reveal from '../components/Reveal.jsx'
import './GetInvolved.css'

/**
 * Home section: Get Involved (auvd-).
 * Split banner — sharp photo on the left half, the same photo washed
 * out behind the text on the right half. Leads to /get-involved/.
 */
export default function GetInvolvedSection() {
  const { t } = useTranslation()

  return (
    <section className="auvd-involved">
      <div className="auvd-involved__photo">
        <img
          className="auvd-involved__img"
          src="/images/women-hub-training.png"
          alt={`${ORG_NAME} training and mentorship session`}
          loading="lazy"
          decoding="async"
          width="800"
          height="600"
        />
      </div>

      <div className="auvd-involved__wash" aria-hidden="true" />

      <div className="auvd-involved__panel">
        <div className="auvd-involved__text">
          <Reveal as="h2" className="auvd-involved__heading" direction="left" duration={650}>
            {t('getInvolved.title')}
          </Reveal>
          <span className="auvd-involved__divider" aria-hidden="true" />
          <Reveal as="p" className="auvd-involved__sub" direction="up" delay={120} duration={650}>
            {t('getInvolved.intro')}
          </Reveal>
          <Reveal as="p" className="auvd-involved__body" direction="up" delay={220} duration={650}>
            {t('getInvolvedCards.intro')}
          </Reveal>
          <Link to="/get-involved/" className="auvd-involved__btn">
            {t('common.learnMore')}
          </Link>
        </div>
      </div>
    </section>
  )
}
