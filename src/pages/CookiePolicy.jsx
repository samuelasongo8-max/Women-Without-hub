import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import './CookiePolicy.css'

export default function CookiePolicy() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('cookieConsent.policyTitle')} />
      <section className="cookie-policy container">
        <p>{t('cookieConsent.policyIntro')}</p>
        <h2>{t('cookieConsent.essential')}</h2>
        <p>{t('cookieConsent.policyStorage')}</p>
        <h2>{t('cookieConsent.analytics')} &amp; {t('cookieConsent.marketing')}</h2>
        <p>{t('cookieConsent.policyOptional')}</p>
        <p>{t('cookieConsent.policyManage')}</p>
      </section>
    </>
  )
}
