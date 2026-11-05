import axios from 'axios'

const isProd = import.meta.env.MODE === 'production'

const baseURL = isProd
  ? import.meta.env.VITE_API_URL || ''
  : ''

if (isProd && !import.meta.env.VITE_API_URL) {
  console.warn('[API] VITE_API_URL not set in production!')
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log('[API →]', config.method?.toUpperCase(), config.baseURL + config.url)
    return config
  })

  api.interceptors.response.use(
    (res) => {
      console.log('[API ←]', res.status, res.config.url)
      return res
    },
    (err) => {
      console.error('[API ERROR]', err.response?.status, err.config?.url, err.message)
      return Promise.reject(err)
    }
  )
}

export default api