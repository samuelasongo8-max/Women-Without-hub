import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import useAdminAuth from './useAdminAuth.js'
import './AdminDashboard.css'

const contentTypes = [
  {
    key: 'posts',
    label: 'Posts',
    description: 'Short updates and featured stories.',
    title: (item) => item.topic,
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'topic', label: 'Topic', type: 'text', required: true },
      { name: 'featuredImage', label: 'Featured image', type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif' },
      { name: 'altText', label: 'Image alt text', type: 'text' },
      { name: 'caption', label: 'Image caption', type: 'text' },
      { name: 'paragraph', label: 'Post content', type: 'textarea', required: true, wide: true },
    ],
  },
  {
    key: 'blogs',
    label: 'Blogs',
    description: 'Publish longer articles and stories.',
    title: (item) => item.blogTitle,
    fields: [
      { name: 'blogTitle', label: 'Blog title', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'blogImage', label: 'Featured image', type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif' },
      { name: 'contentImage', label: 'Content image', type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif' },
      { name: 'altText', label: 'Image alt text', type: 'text' },
      { name: 'blogContent', label: 'Blog content', type: 'textarea', required: true, wide: true },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    description: 'Share publications and downloadable resources.',
    title: (item) => item.reportTitle,
    fields: [
      { name: 'reportTitle', label: 'Report title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'reportDate', label: 'Report date', type: 'date', required: true },
      { name: 'coverImageLink', label: 'Cover image URL', type: 'url' },
      { name: 'reportFileLink', label: 'Report file URL', type: 'url', required: true },
      { name: 'downloadFileName', label: 'Download file name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', wide: true },
    ],
  },
  {
    key: 'updates',
    label: 'Community updates',
    description: 'Keep the community informed about current work.',
    title: (item) => item.title,
    fields: [
      { name: 'title', label: 'Update title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'coverImageLink', label: 'Cover image URL', type: 'url' },
      { name: 'excerpt', label: 'Short excerpt', type: 'textarea' },
      { name: 'update', label: 'Update content', type: 'textarea', required: true, wide: true },
    ],
  },
]

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

export default function AdminSession() {
  const { checking, adminUser } = useAdminAuth()
  const [activeKey, setActiveKey] = useState(contentTypes[0].key)
  const [items, setItems] = useState({})
  const [loadingContent, setLoadingContent] = useState(false)
  const [contentError, setContentError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const activeType = contentTypes.find((type) => type.key === activeKey)

  useEffect(() => {
    if (checking) return undefined

    let active = true
    setLoadingContent(true)
    setContentError('')

    Promise.all(contentTypes.map((type) => (
      api.get(`/api/admin/content/${type.key}`)
    )))
      .then((responses) => {
        if (!active) return
        setItems(Object.fromEntries(
          contentTypes.map((type, index) => [type.key, responses[index].data[type.key]]),
        ))
      })
      .catch((error) => {
        if (active) setContentError(error.response?.data?.message || 'Unable to load dashboard content.')
      })
      .finally(() => {
        if (active) setLoadingContent(false)
      })

    return () => {
      active = false
    }
  }, [checking, refreshKey])

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const hasFiles = activeType.fields.some((field) => field.type === 'file')
    let payload

    if (hasFiles) {
      payload = new FormData()
      activeType.fields.forEach((field) => {
        const value = formData.get(field.name)
        if (field.type === 'file') {
          if (value instanceof File && value.size > 0) payload.append(field.name, value)
        } else {
          payload.append(field.name, String(value || ''))
        }
      })
    } else {
      payload = Object.fromEntries(formData.entries())
    }

    setSubmitting(true)
    setFormMessage('')
    setFormError('')

    try {
      const requestConfig = payload instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
      const response = await api.post(
        `/api/admin/content/${activeKey}`,
        payload,
        requestConfig,
      )
      setFormMessage(response.data.message || `${activeType.label} item saved.`)
      form.reset()
      setRefreshKey((key) => key + 1)
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to save this item.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(itemId) {
    const typeLabel = activeType.label.toLowerCase().replace(/s$/, '')
    if (!window.confirm(`Delete this ${typeLabel}? This cannot be undone.`)) return

    setDeletingId(itemId)
    setFormMessage('')
    setFormError('')
    try {
      await api.delete(`/api/admin/content/${activeKey}/${itemId}`)
      setItems((current) => ({
        ...current,
        [activeKey]: (current[activeKey] || []).filter((item) => item._id !== itemId),
      }))
      setFormMessage(`${activeType.label} item deleted.`)
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to delete this item.')
    } finally {
      setDeletingId('')
    }
  }

  async function handleLogout() {
    setFormError('')
    try {
      await api.post('/api/admin/logout', {})
      window.location.assign('/manage')
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to sign out. Please try again.')
    }
  }

  if (checking) {
    return <main className="admin-dashboard-loading" role="status">Checking your admin session…</main>
  }

  const currentItems = items[activeKey] || []

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <a className="admin-dashboard-brand" href="/" aria-label="Women Without Borders home">
          <img src="/women-hub-logo.png" alt="" />
          <span>Women Without Borders</span>
        </a>
        <div className="admin-dashboard-account">
          <span>Signed in as <strong>{adminUser}</strong></span>
          <button type="button" className="admin-dashboard-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <section className="admin-dashboard-main" aria-labelledby="dashboard-title">
        <div className="admin-dashboard-heading">
          <p className="admin-dashboard-eyebrow">Content management</p>
          <h1 id="dashboard-title">Admin dashboard</h1>
          <p>Create, review, and remove posts, blogs, reports, and community updates.</p>
        </div>

        <nav className="admin-dashboard-tabs" aria-label="Content types">
          {contentTypes.map((type) => (
            <button
              type="button"
              key={type.key}
              className={activeKey === type.key ? 'is-active' : ''}
              aria-pressed={activeKey === type.key}
              onClick={() => {
                setActiveKey(type.key)
                setFormMessage('')
                setFormError('')
              }}
            >
              {type.label}
              <span>{items[type.key]?.length ?? '—'}</span>
            </button>
          ))}
        </nav>

        {formMessage && <p className="admin-dashboard-notice is-success" role="status">{formMessage}</p>}
        {formError && <p className="admin-dashboard-notice is-error" role="alert">{formError}</p>}
        {contentError && (
          <div className="admin-dashboard-notice is-error" role="alert">
            <span>{contentError}</span>
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
          </div>
        )}

        <div className="admin-dashboard-columns">
          <section className="admin-dashboard-panel" aria-labelledby="content-form-title">
            <div className="admin-dashboard-panel-heading">
              <div>
                <h2 id="content-form-title">Add {activeType.label.toLowerCase().replace(/s$/, '')}</h2>
                <p>{activeType.description}</p>
              </div>
            </div>
            <form className="admin-dashboard-form" onSubmit={handleSubmit}>
              <div className="admin-dashboard-fields">
                {activeType.fields.map((field) => (
                  <label
                    className={field.wide || field.type === 'textarea' ? 'is-wide' : ''}
                    key={field.name}
                  >
                    <span>{field.label}{field.required && <em aria-hidden="true"> *</em>}</span>
                    {field.type === 'textarea' ? (
                      <textarea name={field.name} required={field.required} rows={5} />
                    ) : (
                      <input
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        accept={field.accept}
                        maxLength={field.type === 'text' ? 200 : undefined}
                      />
                    )}
                    {field.type === 'file' && <small>JPG, PNG, GIF, or WEBP; maximum 5 MB.</small>}
                  </label>
                ))}
              </div>
              <button className="admin-dashboard-primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : `Save ${activeType.label.toLowerCase().replace(/s$/, '')}`}
              </button>
            </form>
          </section>

          <section className="admin-dashboard-panel admin-dashboard-list" aria-labelledby="saved-content-title">
            <div className="admin-dashboard-panel-heading">
              <div>
                <h2 id="saved-content-title">Saved {activeType.label.toLowerCase()}</h2>
                <p>{currentItems.length} {currentItems.length === 1 ? 'item' : 'items'}</p>
              </div>
              {loadingContent && <span className="admin-dashboard-loading-label">Loading…</span>}
            </div>
            {!loadingContent && currentItems.length === 0 ? (
              <p className="admin-dashboard-empty">Nothing here yet. Use the form to add your first item.</p>
            ) : (
              <ul>
                {currentItems.map((item) => (
                  <li key={item._id}>
                    <div className="admin-dashboard-item-copy">
                      <h3>{activeType.title(item) || 'Untitled'}</h3>
                      <p>
                        {formatDate(item.date || item.reportDate || item.createdAt)}
                        {item.category ? ` · ${item.category}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-dashboard-delete"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      aria-label={`Delete ${activeType.title(item) || 'untitled item'}`}
                    >
                      {deletingId === item._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}
