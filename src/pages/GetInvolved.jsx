
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import GetInvolvedCards from '../sections/GetInvolvedCards.jsx'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import './GetInvolved.css'

export default function GetInvolved() {
  const { t } = useTranslation()
  useHeroImagePreload({
    desktop: '/images/get-involved-banner-desktop.webp',
    mobile: '/images/get-involved-banner-mobile.webp',
  })

  return (
    <div className="getinvolved-page">
      <PageHeader
        title={t('getInvolved.title')}
        introContent={
          <div className="page-intro page-header__get-involved-intro">
            <p>
              {t('getInvolved.pageIntroOne')}
            </p>
            <p>
              {t('getInvolved.pageIntroTwo')}
            </p>
            <p>
              <strong>
                {t('getInvolved.pageClosing')}
              </strong>
            </p>
          </div>
        }
        className="page-header--get-involved"
        minHeight={null}
      />

      {/* Split hero and support cards follow the page title without overlap. */}
      <GetInvolvedCards />
    </div>
  )
}
