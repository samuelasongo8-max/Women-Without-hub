import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import useAdminAuth from './useAdminAuth.js'
import { convertGoogleDriveUrl } from '../utils/driveUrl.js'
import { normalizeBlog } from '../utils/blogFields.js'
import { normalizeReport } from '../utils/reportFields.js'
import { normalizeUpdate } from '../utils/updateFields.js'
import RichTextEditor from '../components/RichTextEditor.jsx'
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
      { name: 'imageUrl', label: 'Google Drive image URL', type: 'url' },
      { name: 'imageAlt', label: 'Image alt text', type: 'text' },
      { name: 'imageCaption', label: 'Image caption', type: 'text' },
      { name: 'content', label: 'Post content', type: 'textarea', required: true, wide: true },
    ],
  },
  {
    key: 'blogs',
    label: 'Blogs',
    description: 'Publish longer articles and stories.',
    title: (item) => normalizeBlog(item).title,
    fields: [
      { name: 'blogTitle', label: 'Blog title', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'featuredImageUrl', label: 'Featured image URL', type: 'url' },
      { name: 'contentImageUrl', label: 'Content image URL', type: 'url' },
      { name: 'altText', label: 'Image alt text', type: 'text' },
      { name: 'blogContent', label: 'Blog content', type: 'textarea', required: true, wide: true },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    description: 'Share publications and downloadable resources.',
    title: (item) => normalizeReport(item).title,
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
      { name: 'images', label: 'Upload images (up to 2)', type: 'file', accept: 'image/*', multiple: true },
      { name: 'excerpt', label: 'Short excerpt', type: 'textarea' },
      { name: 'update', label: 'Update content', type: 'richtext', required: true, wide: true },
    ],
  },
]

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

function hasRichTextContent(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()
    .length > 0
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
  const [blogSubmitting, setBlogSubmitting] = useState(false)
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editingItem, setEditingItem] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [imagePreviews, setImagePreviews] = useState({})
  const [blogContentHtml, setBlogContentHtml] = useState('')
  const [updateContentHtml, setUpdateContentHtml] = useState('')
  const activeType = contentTypes.find((type) => type.key === activeKey)

  useEffect(() => {
    if (checking) return undefined

    let active = true
    setLoadingContent(true)
    setContentError('')

    const loadPromises = contentTypes.map((type) => {
      if (type.key === 'posts') {
        return api.get('/api/posts').then((res) => [type.key, res.data.posts])
      }
      if (type.key === 'blogs') {
        return api.get('/api/blogs').then((res) => [type.key, res.data.blogs])
      }
      if (type.key === 'reports') {
        return api.get('/api/reports').then((res) => [
          type.key,
          (res.data.reports || []).map(normalizeReport),
        ])
      }
      if (type.key === 'updates') {
        return api.get('/api/admin/content/updates').then((res) => [
          type.key,
          (res.data.updates || []).map(normalizeUpdate),
        ])
      }
      return api.get(`/api/admin/content/${type.key}`).then((res) => [type.key, res.data[type.key]])
    })
    Promise.all(loadPromises)
      .then((results) => {
        if (!active) return
        setItems(Object.fromEntries(results))
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
    if (submitting ||
      (activeKey === 'blogs' && blogSubmitting) ||
      (activeKey === 'reports' && reportSubmitting)
    ) return
    const form = event.currentTarget
    const formData = new FormData(form)
    const hasFiles = activeType.fields.some((field) => field.type === 'file')
    let payload

    if (hasFiles) {
      payload = new FormData()
      activeType.fields.forEach((field) => {
        if (field.type === 'richtext') return
        const value = formData.get(field.name)
        if (field.type === 'file') {
          for (const file of formData.getAll(field.name)) {
            if (file instanceof File && file.size > 0) payload.append(field.name, file)
          }
        } else {
          payload.append(field.name, String(value || ''))
        }
      })
    } else {
      payload = Object.fromEntries(formData.entries())
    }

    if (activeKey === 'blogs') {
      if (!hasRichTextContent(blogContentHtml)) {
        setFormMessage('')
        setFormError('Blog content is required.')
        return
      }
      payload.blogContent = blogContentHtml
    }
    if (activeKey === 'updates') {
      if (!hasRichTextContent(updateContentHtml)) {
        setFormMessage('')
        setFormError('Update content is required.')
        return
      }
      payload.append('update', updateContentHtml)
    }

    setSubmitting(true)
    if (activeKey === 'blogs') setBlogSubmitting(true)
    if (activeKey === 'reports') setReportSubmitting(true)
    setFormMessage('')
    setFormError('')

    try {
      // Convert Google Drive URL for posts before sending
      if (activeKey === 'posts' && payload.imageUrl) {
        payload.imageUrl = convertGoogleDriveUrl(payload.imageUrl)
      }
      const requestConfig = payload instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
      const endpoint = activeKey === 'posts'
        ? '/api/posts'
        : activeKey === 'blogs'
          ? '/api/blogs'
          : activeKey === 'reports'
            ? '/api/reports'
          : activeKey === 'updates'
            ? '/api/admin/content/updates'
            : `/api/admin/content/${activeKey}`
      const response = await api.post(endpoint, payload, requestConfig)
      if (activeKey === 'blogs') {
        const blogsResponse = await api.get('/api/blogs')
        setItems((current) => ({ ...current, blogs: blogsResponse.data.blogs || [] }))
        setFormMessage('Blog published successfully!')
      } else if (activeKey === 'reports') {
        const reportsResponse = await api.get('/api/reports')
        setItems((current) => ({
          ...current,
          reports: (reportsResponse.data.reports || []).map(normalizeReport),
        }))
        setFormMessage('Report published successfully!')
      } else if (activeKey === 'updates') {
        const updatesResponse = await api.get('/api/admin/content/updates')
        setItems((current) => ({
          ...current,
          updates: (updatesResponse.data.updates || []).map(normalizeUpdate),
        }))
        // Invalidate frontend cache so the public site picks up the new update
        try { localStorage.setItem('community_updates_invalidated', Date.now().toString()) } catch {}
        setFormMessage('Community update published successfully!')
      } else {
        setFormMessage(response.data.message || `${activeType.label} item saved.`)
      }
      form.reset()
      if (activeKey === 'blogs') setBlogContentHtml('')
      if (activeKey === 'updates') setUpdateContentHtml('')
      setImagePreviews({})
      setRefreshKey((key) => key + 1)
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to save this item.')
    } finally {
      setSubmitting(false)
      if (activeKey === 'blogs') setBlogSubmitting(false)
      if (activeKey === 'reports') setReportSubmitting(false)
    }
  }

  async function handleDelete(itemId) {
    const typeLabel = activeType.label.toLowerCase().replace(/s$/, '')
    if (!window.confirm(`Delete this ${typeLabel}? This cannot be undone.`)) return

    setDeletingId(itemId)
    setFormMessage('')
    setFormError('')
    try {
      const endpoint = activeKey === 'posts'
        ? `/api/posts/${itemId}`
        : activeKey === 'blogs'
          ? `/api/blogs/${itemId}`
          : activeKey === 'reports'
            ? `/api/reports/${itemId}`
          : activeKey === 'updates'
            ? `/api/updates/${itemId}`
            : `/api/admin/content/${activeKey}/${itemId}`
      await api.delete(endpoint)
      setItems((current) => ({
        ...current,
        [activeKey]: (current[activeKey] || []).filter((item) => item._id !== itemId),
      }))
      // Invalidate frontend cache if a community update was deleted
      if (activeKey === 'updates') {
        try { localStorage.setItem('community_updates_invalidated', Date.now().toString()) } catch {}
      }
      setFormMessage(`${activeType.label} item deleted.`)
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to delete this item.')
    } finally {
      setDeletingId('')
    }
  }

  function startEdit(item) {
    setFormMessage('')
    setFormError('')
    setEditingId(item._id)
    const nextItem = {
      ...item,
      date: item.date ? String(item.date).slice(0, 10) : '',
    }
    if (activeKey === 'blogs') {
      nextItem.blogContent = item.blogContent || item.content || ''
    }
    if (activeKey === 'reports') {
      nextItem.reportTitle = item.reportTitle || item.title || ''
      nextItem.reportDate = item.reportDate || item.date || ''
      nextItem.coverImageLink = item.coverImageLink || item.coverImage || ''
      nextItem.reportFileLink = item.reportFileLink || item.fileLink || ''
      nextItem.downloadFileName = item.downloadFileName || item.downloadName || ''
    }
    if (activeKey === 'updates') {
      nextItem.update = item.content || item.update || ''
      nextItem.excerpt = item.excerpt || ''
      nextItem.coverImageLink = item.image || item.coverImageLink || ''
    }
    setEditingItem(nextItem)
  }

  function cancelEdit() {
    setEditingId('')
    setEditingItem({})
  }

  const editField = (field) => (e) =>
    setEditingItem((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleEditPost(event) {
    event.preventDefault()
    setFormError('')
    setFormMessage('')

    const payload = {
      date: editingItem.date,
      topic: editingItem.topic,
      imageUrl: convertGoogleDriveUrl(editingItem.imageUrl || ''),
      imageAlt: editingItem.imageAlt || '',
      imageCaption: editingItem.imageCaption || '',
      content: editingItem.content,
    }

    setSavingEdit(true)
    try {
      await api.put(`/api/posts/${editingId}`, payload)
      setItems((current) => ({
        ...current,
        [activeKey]: (current[activeKey] || []).map((i) =>
          i._id === editingId ? { ...i, ...payload } : i
        ),
      }))
      setFormMessage('Post updated.')
      setEditingId('')
      setEditingItem({})
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to update post.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleEditBlog(event) {
    event.preventDefault()
    setFormError('')
    setFormMessage('')

    const payload = {
      blogTitle: editingItem.blogTitle || editingItem.title || '',
      date: editingItem.date,
      featuredImageUrl: convertGoogleDriveUrl(editingItem.featuredImageUrl || ''),
      contentImageUrl: convertGoogleDriveUrl(editingItem.contentImageUrl || ''),
      altText: editingItem.altText || editingItem.imageAlt || '',
      blogContent: editingItem.blogContent || editingItem.content || '',
    }

    if (!hasRichTextContent(payload.blogContent)) {
      setFormError('Blog content is required.')
      return
    }

    setSavingEdit(true)
    try {
      await api.put(`/api/blogs/${editingId}`, payload)
      const blogsResponse = await api.get('/api/blogs')
      setItems((current) => ({ ...current, blogs: blogsResponse.data.blogs || [] }))
      setFormMessage('Blog updated.')
      setEditingId('')
      setEditingItem({})
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to update blog.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleEditReport(event) {
    event.preventDefault()
    setFormError('')
    setFormMessage('')

    const payload = {
      reportTitle: editingItem.reportTitle || editingItem.title || '',
      category: editingItem.category || '',
      reportDate: editingItem.reportDate || editingItem.date || '',
      coverImageLink: convertGoogleDriveUrl(
        editingItem.coverImageLink || editingItem.coverImage || ''
      ),
      reportFileLink: editingItem.reportFileLink || editingItem.fileLink || '',
      downloadFileName: editingItem.downloadFileName || editingItem.downloadName || '',
      description: editingItem.description || '',
    }

    if (
      !payload.reportTitle.trim() ||
      !payload.category.trim() ||
      !payload.reportDate ||
      !payload.reportFileLink.trim()
    ) {
      setFormError('Title, category, date and file link are required.')
      return
    }

    setSavingEdit(true)
    try {
      await api.put(`/api/reports/${editingId}`, payload)
      const reportsResponse = await api.get('/api/reports')
      setItems((current) => ({
        ...current,
        reports: (reportsResponse.data.reports || []).map(normalizeReport),
      }))
      setFormMessage('Report updated.')
      setEditingId('')
      setEditingItem({})
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to update report.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleEditUpdate(event) {
    event.preventDefault()
    setFormError('')
    setFormMessage('')
    const values = {
      title: editingItem.title || '',
      category: editingItem.category || '',
      author: editingItem.author || '',
      excerpt: editingItem.excerpt || '',
      coverImageLink: convertGoogleDriveUrl(editingItem.coverImageLink || ''),
      update: editingItem.update || editingItem.content || '',
    }
    if (!values.title.trim() || !values.update.trim()) {
      setFormError('Title and update content are required.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const payload = new FormData()
    Object.entries(values).forEach(([key, value]) => payload.append(key, value))
    for (const file of formData.getAll('images')) {
      if (file instanceof File && file.size > 0) payload.append('images', file)
    }
    setSavingEdit(true)
    try {
      await api.put(`/api/admin/content/updates/${editingId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const updatesResponse = await api.get('/api/admin/content/updates')
      setItems((current) => ({
        ...current,
        updates: (updatesResponse.data.updates || []).map(normalizeUpdate),
      }))
      // Invalidate frontend cache so the public site picks up the updated update
      try { localStorage.setItem('community_updates_invalidated', Date.now().toString()) } catch {}
      setFormMessage('Community update updated.')
      setEditingId('')
      setEditingItem({})
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to update community update.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleLogout() {
    setFormError('')
    try {
      await api.post('/api/admin/logout', {})
      window.location.assign('/')
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
          <p>Create, review, edit, and remove posts, blogs, reports, and community updates.</p>
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
                setEditingId('')
                setEditingItem({})
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
                {activeType.fields.map((field) => {
                  const fieldClassName = field.wide || field.type === 'textarea' ? 'is-wide' : ''
                  const fieldLabel = <span>{field.label}{field.required && <em aria-hidden="true"> *</em>}</span>
                  const isImageField = (
                    field.name === 'imageUrl' ||
                    field.name === 'featuredImageUrl' ||
                    field.name === 'contentImageUrl' ||
                    field.name === 'coverImageLink'
                  )

                  if (activeKey === 'blogs' && field.name === 'blogContent') {
                    return (
                      <div className="is-wide" key={field.name}>
                        {fieldLabel}
                        <RichTextEditor
                          value={blogContentHtml}
                          onChange={setBlogContentHtml}
                          placeholder="Write your blog content…"
                        />
                      </div>
                    )
                  }

                  if (activeKey === 'updates' && field.name === 'update') {
                    return (
                      <div className="is-wide" key={field.name}>
                        {fieldLabel}
                        <RichTextEditor
                          value={updateContentHtml}
                          onChange={setUpdateContentHtml}
                          placeholder="Write your community update…"
                        />
                      </div>
                    )
                  }

                  return (
                    <label className={fieldClassName} key={field.name}>
                      {fieldLabel}
                      {field.type === 'textarea' ? (
                        <textarea name={field.name} required={field.required} rows={5} />
                      ) : field.type === 'url' ? (
                        <>
                          <input
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            onChange={(e) => {
                              setImagePreviews((prev) => ({
                                ...prev,
                                [field.name]: e.target.value,
                              }))
                            }}
                          />
                          {(activeKey === 'posts' && field.name === 'imageUrl') ||
                            (activeKey === 'blogs' && (
                              field.name === 'featuredImageUrl' ||
                              field.name === 'contentImageUrl'
                            )) ||
                            ((activeKey === 'reports' || activeKey === 'updates') && field.name === 'coverImageLink') ? (
                            <small>{activeKey === 'updates' ? 'Share the image as "Anyone with the link" (Viewer). Folder links do not work, use the image file link.' : 'Drive image must be shared as "Anyone with the link".'}</small>
                          ) : activeKey === 'reports' && field.name === 'reportFileLink' ? (
                            <small>Paste the Drive link of the PDF, shared as "Anyone with the link".</small>
                          ) : null}
                          {isImageField && imagePreviews[field.name] && (
                            <img
                              src={convertGoogleDriveUrl(imagePreviews[field.name])}
                              alt="Image preview"
                              className="admin-dashboard-image-preview"
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          )}
                        {activeKey === 'updates' && field.name === 'coverImageLink' && (
                            <p className="admin-dashboard-field-tip">
                              Tip: Drive links can break over time. For a more reliable image, upload to Cloudinary (already used by this project) and paste that URL instead.
                            </p>
                          )}</>
                      ) : (
                        <input
                          name={field.name}
                          type={field.type}
                          required={field.required}
                          accept={field.accept}
                          multiple={field.multiple}
                          maxLength={field.type === 'text' ? 200 : undefined}
                        />
                      )}
                    </label>
                  )
                })}
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

                    {(activeKey === 'posts' || activeKey === 'blogs' || activeKey === 'reports' || activeKey === 'updates') && (
                      <button
                        type="button"
                        className="admin-dashboard-edit"
                        onClick={() => startEdit(item)}
                        disabled={editingId === item._id}
                        aria-label={`Edit ${activeType.title(item) || 'untitled item'}`}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-dashboard-delete"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      aria-label={`Delete ${activeType.title(item) || 'untitled item'}`}
                    >
                      {deletingId === item._id ? 'Deleting…' : 'Delete'}
                    </button>

                    {activeKey === 'posts' && editingId === item._id && (
                      <div className="admin-dashboard-edit-form">
                        <form className="admin-dashboard-form" onSubmit={handleEditPost}>
                          <h4>Edit post</h4>
                          <div className="admin-dashboard-fields">
                            <label>
                              <span>Date <em aria-hidden="true">*</em></span>
                              <input
                                type="date"
                                required
                                value={editingItem.date || ''}
                                onChange={editField('date')}
                              />
                            </label>
                            <label>
                              <span>Topic <em aria-hidden="true">*</em></span>
                              <input
                                type="text"
                                required
                                maxLength={200}
                                value={editingItem.topic || ''}
                                onChange={editField('topic')}
                              />
                            </label>
                            <label>
                              <span>Google Drive image URL</span>
                              <input
                                type="text"
                                value={editingItem.imageUrl || ''}
                                onChange={editField('imageUrl')}
                              />
                              <small>Drive file must be shared as "Anyone with the link".</small>
                              {editingItem.imageUrl && (
                                <img
                                  src={convertGoogleDriveUrl(editingItem.imageUrl)}
                                  alt="Image preview"
                                  className="admin-dashboard-image-preview"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.target.style.display = 'none' }}
                                />
                              )}
                            </label>
                            <label>
                              <span>Image alt text</span>
                              <input
                                type="text"
                                maxLength={200}
                                value={editingItem.imageAlt || ''}
                                onChange={editField('imageAlt')}
                              />
                            </label>
                            <label>
                              <span>Image caption</span>
                              <input
                                type="text"
                                maxLength={200}
                                value={editingItem.imageCaption || ''}
                                onChange={editField('imageCaption')}
                              />
                            </label>
                            <label className="is-wide">
                              <span>Post content <em aria-hidden="true">*</em></span>
                              <textarea
                                required
                                rows={5}
                                value={editingItem.content || ''}
                                onChange={editField('content')}
                              />
                            </label>
                          </div>
                          <button className="admin-dashboard-primary" type="submit" disabled={savingEdit}>
                            {savingEdit ? 'Saving…' : 'Save changes'}
                          </button>
                          <button type="button" onClick={cancelEdit} disabled={savingEdit}>
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}

                    {activeKey === 'blogs' && editingId === item._id && (
                      <div className="admin-dashboard-edit-form">
                        <form className="admin-dashboard-form" onSubmit={handleEditBlog}>
                          <h4>Edit blog</h4>
                          <div className="admin-dashboard-fields">
                            <label>
                              <span>Date <em aria-hidden="true">*</em></span>
                              <input
                                type="date"
                                required
                                value={editingItem.date || ''}
                                onChange={editField('date')}
                              />
                            </label>
                            <label>
                              <span>Blog title <em aria-hidden="true">*</em></span>
                              <input
                                type="text"
                                required
                                maxLength={200}
                                value={editingItem.blogTitle || editingItem.title || ''}
                                onChange={editField('blogTitle')}
                              />
                            </label>
                            <label>
                              <span>Featured image URL</span>
                              <input
                                type="url"
                                value={editingItem.featuredImageUrl || ''}
                                onChange={editField('featuredImageUrl')}
                              />
                              <small>Drive file must be shared as "Anyone with the link".</small>
                              {editingItem.featuredImageUrl && (
                                <img
                                  src={convertGoogleDriveUrl(editingItem.featuredImageUrl)}
                                  alt="Featured image preview"
                                  className="admin-dashboard-image-preview"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.target.style.display = 'none' }}
                                />
                              )}
                            </label>
                            <label>
                              <span>Content image URL</span>
                              <input
                                type="url"
                                value={editingItem.contentImageUrl || ''}
                                onChange={editField('contentImageUrl')}
                              />
                              <small>Drive file must be shared as "Anyone with the link".</small>
                              {editingItem.contentImageUrl && (
                                <img
                                  src={convertGoogleDriveUrl(editingItem.contentImageUrl)}
                                  alt="Content image preview"
                                  className="admin-dashboard-image-preview"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.target.style.display = 'none' }}
                                />
                              )}
                            </label>
                            <label>
                              <span>Image alt text</span>
                              <input
                                type="text"
                                maxLength={200}
                                value={editingItem.altText || editingItem.imageAlt || ''}
                                onChange={editField('altText')}
                              />
                            </label>
                            <label className="is-wide">
                              <span>Blog content <em aria-hidden="true">*</em></span>
                              <RichTextEditor
                                value={editingItem.blogContent || editingItem.content || ''}
                                onChange={(html) => setEditingItem((current) => ({
                                  ...current,
                                  blogContent: html,
                                }))}
                                placeholder="Write your blog content…"
                              />
                            </label>
                          </div>
                          <button className="admin-dashboard-primary" type="submit" disabled={savingEdit}>
                            {savingEdit ? 'Saving…' : 'Save changes'}
                          </button>
                          <button type="button" onClick={cancelEdit} disabled={savingEdit}>
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}

                    {activeKey === 'reports' && editingId === item._id && (
                      <div className="admin-dashboard-edit-form">
                        <form className="admin-dashboard-form" onSubmit={handleEditReport}>
                          <h4>Edit report</h4>
                          <div className="admin-dashboard-fields">
                            <label>
                              <span>Report title <em aria-hidden="true">*</em></span>
                              <input
                                type="text"
                                required
                                maxLength={200}
                                value={editingItem.reportTitle || editingItem.title || ''}
                                onChange={editField('reportTitle')}
                              />
                            </label>
                            <label>
                              <span>Category <em aria-hidden="true">*</em></span>
                              <input
                                type="text"
                                required
                                value={editingItem.category || ''}
                                onChange={editField('category')}
                              />
                            </label>
                            <label>
                              <span>Report date <em aria-hidden="true">*</em></span>
                              <input
                                type="date"
                                required
                                value={(editingItem.reportDate || editingItem.date || '').slice(0, 10)}
                                onChange={editField('reportDate')}
                              />
                            </label>
                            <label>
                              <span>Cover image URL</span>
                              <input
                                type="url"
                                value={editingItem.coverImageLink || editingItem.coverImage || ''}
                                onChange={editField('coverImageLink')}
                              />
                              <small>Drive image must be shared as "Anyone with the link".</small>
                              {(editingItem.coverImageLink || editingItem.coverImage) && (
                                <img
                                  src={convertGoogleDriveUrl(editingItem.coverImageLink || editingItem.coverImage)}
                                  alt="Cover image preview"
                                  className="admin-dashboard-image-preview"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.target.style.display = 'none' }}
                                />
                              )}
                            </label>
                            <label>
                              <span>Report file link <em aria-hidden="true">*</em></span>
                              <input
                                type="url"
                                required
                                value={editingItem.reportFileLink || editingItem.fileLink || ''}
                                onChange={editField('reportFileLink')}
                              />
                              <small>Paste the Drive link of the PDF, shared as "Anyone with the link".</small>
                            </label>
                            <label>
                              <span>Download file name</span>
                              <input
                                type="text"
                                value={editingItem.downloadFileName || editingItem.downloadName || ''}
                                onChange={editField('downloadFileName')}
                              />
                            </label>
                            <label className="is-wide">
                              <span>Description</span>
                              <textarea
                                rows={5}
                                value={editingItem.description || ''}
                                onChange={editField('description')}
                              />
                            </label>
                          </div>
                          <button className="admin-dashboard-primary" type="submit" disabled={savingEdit}>
                            {savingEdit ? 'Saving…' : 'Save changes'}
                          </button>
                          <button type="button" onClick={cancelEdit} disabled={savingEdit}>
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}

                    {activeKey === 'updates' && editingId === item._id && (
                      <div className="admin-dashboard-edit-form">
                        <form className="admin-dashboard-form" onSubmit={handleEditUpdate}>
                          <h4>Edit community update</h4>
                          <div className="admin-dashboard-fields">
                            <label><span>Update title <em aria-hidden="true">*</em></span><input type="text" required maxLength={200} value={editingItem.title || ''} onChange={editField('title')} /></label>
                            <label><span>Category</span><input type="text" value={editingItem.category || ''} onChange={editField('category')} /></label>
                            <label><span>Author</span><input type="text" value={editingItem.author || ''} onChange={editField('author')} /></label>
                            <label><span>Cover image URL</span><input type="url" value={editingItem.coverImageLink || ''} onChange={editField('coverImageLink')} /><small>Share the image as "Anyone with the link" (Viewer). Folder links do not work, use the image file link.</small>{editingItem.coverImageLink && <img src={convertGoogleDriveUrl(editingItem.coverImageLink)} alt="Cover image preview" className="admin-dashboard-image-preview" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none' }} />}</label>
                            <label><span>Replace or add images (up to 2)</span><input name="images" type="file" accept="image/*" multiple /><small>Uploading images replaces the current image set. JPG, PNG, GIF, or WEBP; 5 MB maximum per image.</small></label>
                            <label className="is-wide"><span>Short excerpt</span><textarea rows={3} value={editingItem.excerpt || ''} onChange={editField('excerpt')} /></label>
                            <div className="is-wide">
                              <span>Update content <em aria-hidden="true">*</em></span>
                              <RichTextEditor
                                value={editingItem.update || editingItem.content || ''}
                                onChange={(html) => setEditingItem((current) => ({ ...current, update: html }))}
                                placeholder="Write your community update…"
                              />
                            </div>
                          </div>
                          <button className="admin-dashboard-primary" type="submit" disabled={savingEdit}>{savingEdit ? 'Saving…' : 'Save changes'}</button>
                          <button type="button" onClick={cancelEdit} disabled={savingEdit}>Cancel</button>
                        </form>
                      </div>
                    )}
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
