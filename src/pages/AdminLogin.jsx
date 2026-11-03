import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import './AdminAuth.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    api.get('/api/admin/me')
      .then(() => navigate('/manage/session', { replace: true }))
      .catch(() => setChecking(false))
  }, [navigate])

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.username.trim() || !form.password) return setError('Enter your username and password.')
    setSubmitting(true)
    setError('')
    api.post('/api/admin/login', form)
      .then(() => navigate('/manage/session', { replace: true }))
      .catch((err) => setError(err.response?.data?.message || 'Unable to sign in.'))
      .finally(() => setSubmitting(false))
  }

  if (checking) return <div className="admin-auth-page"><div className="admin-auth-card"><p>Loading…</p></div></div>
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="login-title">
        <div className="admin-auth-mark" aria-hidden="true">•</div>
        <h1 id="login-title">Sign in</h1>
        <p className="admin-auth-subtitle">Use your account credentials to continue.</p>
        {error && <p className="admin-auth-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <label>Username<input name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" /></label>
          <button disabled={submitting}>{submitting ? 'Signing in…' : 'Continue'}</button>
        </form>
        <Link className="admin-auth-secondary" to="/manage/setup">Set up an account</Link>
      </section>
    </main>
  )
}
