import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import './AdminAuth.css'

export default function AdminRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.username.trim() || form.username.trim().length < 3) return setError('Username must be at least 3 characters.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setSubmitting(true)
    setError('')
    api.post('/api/admin/register', { username: form.username.trim(), password: form.password })
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
          <label>Username<input name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="off" /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" /></label>
          <label>Confirm password<input type="password" name="confirm" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" /></label>
          <button disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
        </form>
        <Link className="admin-auth-secondary" to="/manage">Already have an account? Sign in</Link>
      </section>
    </main>
  )
}
