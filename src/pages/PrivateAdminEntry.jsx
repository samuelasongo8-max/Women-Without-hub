import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api/axios.js'
import Layout from '../components/Layout.jsx'
import Seo from '../components/Seo.jsx'
import AdminLogin from './AdminLogin.jsx'
import NotFound from './NotFound.jsx'

export default function PrivateAdminEntry() {
  const { pathname } = useLocation()
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    setChecking(true)
    setAllowed(false)

    api.get('/api/admin/private-entry-check', {
      headers: { 'X-Private-Admin-Path': pathname },
    })
      .then(() => {
        if (active) setAllowed(true)
      })
      .catch(() => {
        if (active) setAllowed(false)
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => { active = false }
  }, [pathname])

  if (checking) {
    return (
      <>
        <Seo />
        <main className="admin-auth-page" aria-busy="true" />
      </>
    )
  }

  if (allowed) {
    return (
      <>
        <Seo />
        <AdminLogin />
      </>
    )
  }

  return <Layout><NotFound /></Layout>
}
