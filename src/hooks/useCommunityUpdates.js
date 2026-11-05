import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { normalizeUpdate } from '../utils/updateFields.js'

export default function useCommunityUpdates() {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    api.get('/api/updates')
      .then((response) => {
        if (!active) return
        const seen = new Set()
        const next = (response.data?.updates || [])
          .map(normalizeUpdate)
          .filter((item) => item._id && !seen.has(item._id) && seen.add(item._id))
        setUpdates(next)
      })
      .catch((requestError) => {
        if (!active) return
        setError(requestError)
        setUpdates([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  return { updates, loading, error }
}
