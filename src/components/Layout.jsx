import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Seo from './Seo.jsx'
import ScrollArrows from './ScrollArrows.jsx'
import ChatAssistantLauncher from './ChatAssistantLauncher.jsx'

export default function Layout() {
  const { t } = useTranslation()
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        {t('a11y.skipToMain')}
      </a>
      <Seo />
      <Navbar />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollArrows />
      <ChatAssistantLauncher />
    </div>
  )
}
