import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './AdminAuth.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
    if (!form.email.trim() || !form.password) return setError('Enter your email and password.')
    setSubmitting(true)
    setError('')
    api.post('/api/admin/login', { email: form.email.trim(), password: form.password })
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
        <p className="admin-auth-subtitle">Use your email and password to continue.</p>
        {error && <p className="admin-auth-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <label>Email address<input type="text" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="username" /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" /></label>
          <button disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <Link className="admin-auth-secondary" to="/manage/setup">Create account</Link>
      </section>
    </main>
  )
}
