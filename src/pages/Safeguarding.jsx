import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'

export default function Safeguarding() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader
        title={t('safeguarding.title')}
        intro={t('safeguarding.intro')}
      />

      <section className="section container prose">
        <h2>{t('safeguarding.commitment', { defaultValue: 'Our commitment' })}</h2>
        <p>
          {t('safeguarding.commitmentText')}
        </p>

        <h2>{t('safeguarding.howWeWork', { defaultValue: 'How we work' })}</h2>
        <ul>
          {['recruitment', 'focalPoints', 'reporting', 'survivorResponse'].map(
            (key) => (
              <li key={key}>{t(`safeguarding.practices.${key}`)}</li>
            ),
          )}
        </ul>

        <h2>{t('safeguarding.raiseConcern', { defaultValue: 'Raise a concern' })}</h2>
        <p>
          {t('safeguarding.concernPrefix')}{' '}
          <Link to="/contact/">{t('nav.contact')}</Link>
          {` ${t('safeguarding.confidentialSuffix')}`}
        </p>
      </section>
    </>
  )
}
