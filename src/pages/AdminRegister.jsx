import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './AdminAuth.css'

export default function AdminRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    if (!email || !isValidEmail(email)) return setError('Enter a valid email address.')
    if (!form.password || form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setSubmitting(true)
    setError('')
    api.post('/api/admin/register', {
      email,
      password: form.password,
    })
      .then(() => { setSuccess(true); setTimeout(() => navigate('/manage'), 1200) })
      .catch((err) => setError(err.response?.data?.message || 'Unable to create the account.'))
      .finally(() => setSubmitting(false))
  }

  if (success) return <main className="admin-auth-page"><section className="admin-auth-card"><div className="admin-auth-mark" aria-hidden="true">✓</div><h1>Account created</h1><p className="admin-auth-subtitle">Redirecting to sign in…</p></section></main>
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="setup-title">
        <div className="admin-auth-mark" aria-hidden="true">•</div><h1 id="setup-title">Create account</h1><p className="admin-auth-subtitle">Set up your access account.</p>
        {error && <p className="admin-auth-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-auth-form" autoComplete="off">
          <label>Email address<input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" /></label>
          <label>Confirm password<input type="password" name="confirm" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" /></label>
          <button disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
        </form>
        <Link className="admin-auth-secondary" to="/manage">Already have an account? Sign in</Link>
      </section>
    </main>
  )
}
