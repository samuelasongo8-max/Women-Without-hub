import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { convertGoogleDriveUrl } from '../utils/driveUrl.js'
import api from '../api/axios.js'
import './PostDetail.css'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/api/posts/${id}`)
      .then((res) => {
        setPost(res.data.post)
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          'Post not found.'
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="post-detail-page">
      <p className="post-detail__loading">
        Loading…
      </p>
    </div>
  )

  if (error || !post) return (
    <div className="post-detail-page">
      <p className="post-detail__error">{error || 'Post not found.'}</p>
      <button
        className="post-detail__back"
        onClick={() => navigate('/impact/post')}
      >
        ← Back to Posts
      </button>
    </div>
  )

  return (
    <div className="post-detail-page">
      <div className="post-detail__container">
        <div className="post-detail__left">
          {post.imageUrl && (
            <img
              className="post-detail__image"
              src={convertGoogleDriveUrl(post.imageUrl)}
              alt={post.imageAlt || post.topic}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          {post.imageCaption && (
            <p className="post-detail__caption">
              {post.imageCaption}
            </p>
          )}
        </div>
        <div className="post-detail__right">
          <p className="post-detail__content">
            {post.content}
          </p>
        </div>
      </div>
      <div className="post-detail__footer">
        <button
          className="post-detail__back"
          onClick={() => navigate('/impact/post')}
        >
          ← Back to Posts
        </button>
      </div>
    </div>
  )
}
