
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import GetInvolvedCards from '../sections/GetInvolvedCards.jsx'
import useHeroImagePreload from '../hooks/useHeroImagePreload.js'
import './GetInvolved.css'

export default function GetInvolved() {
  const { pathname } = useLocation()
  useHeroImagePreload({
    desktop: '/images/get-involved-banner-desktop.webp',
    mobile: '/images/get-involved-banner-mobile.webp',
  })

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="getinvolved-page">
      <PageHeader
        title="Get Involved"
        introContent={
          <div className="page-intro page-header__get-involved-intro">
            <p>
              we believe that lasting impact begins when people come together to
              support, empower, and uplift one another.
            </p>
            <p>
              There are many ways to get involved, whether by donating to support
              our programmes, volunteering your time, mentoring young women,
              sharing your skills, or partnering with us to create new
              opportunities. Every contribution, big or small, can help open
              doors, strengthen confidence, and make a meaningful difference in
              the lives of women and girls in Kakuma Refugee Camp, Kenya.
            </p>
            <p>
              <strong>
                Join us in creating a future where every girl and young woman
                has the opportunity to thrive.
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
