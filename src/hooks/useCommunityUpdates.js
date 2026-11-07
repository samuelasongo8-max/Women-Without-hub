import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { normalizeUpdate } from '../utils/updateFields.js'

export default function useCommunityUpdates() {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const url = '/api/updates'

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    api
      .get(url)
      .then((response) => {
        if (!active) return
        const publicUpdates = response.data.updates || []
        const normalized = publicUpdates.map((item) => normalizeUpdate(item))
        setUpdates(normalized)
      })
      .catch((requestError) => {
        if (!active) return
        setError(requestError)
        setUpdates([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { updates, loading, error }
}