import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function useAdminAuth() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [adminUser, setAdminUser] = useState('')

  useEffect(() => {
    let active = true

    api.get('/api/admin/me')
      .then((response) => {
        if (!active) return
        if (response.data.ok) setAdminUser(response.data.username)
        else navigate('/manage', { replace: true })
      })
      .catch(() => {
        if (active) navigate('/manage', { replace: true })
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [navigate])

  return { checking, adminUser }
}
