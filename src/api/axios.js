import axios from 'axios'

const api = axios.create({
  // Keep admin cookies first party by sending API calls through Vercel's
  // same-origin rewrite to Render.
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
