import { useState } from 'react'
import { getToken } from '../utils/auth'
import '../styles/EditPost.css'

export default function EditPost({ post, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    description: post.description || '',
    status: post.status || 'ACTIVE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const animalId = post.idAnimal ?? post.idPost

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const token = getToken()
      const response = await fetch(`http://localhost:8080/post/${post.idPost}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: formData.description || null,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        setError('Could not update the post. Please try again.')
        return
      }

      const data = await response.json()
      onSuccess?.(data)
      onClose?.()
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setError(null)
    setDeleting(true)

    try {
      const token = getToken()
      const response = await fetch(`http://localhost:8080/animals/${animalId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        setError('Could not delete the post. Please try again.')
        setShowDeleteConfirm(false)
        return
      }

      const data = await response.json()
      onSuccess?.(data)
      onClose?.()
    } catch {
      setError('Connection error. Please try again.')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  const busy = loading || deleting

  return (
    <form className="edit-form" onSubmit={handleSubmit}>

      <div className="edit-field">
        <label className="edit-label">Description</label>
        <textarea
          className="edit-textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="edit-field">
        <label className="edit-label">Status</label>
        <select className="edit-select" name="status" value={formData.status} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {error && <p className="edit-error">{error}</p>}

      <div className="edit-actions">
        <button
          className="edit-btn-delete"
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={busy}
        >
          Delete
        </button>
        <div className="edit-actions-right">
          <button className="edit-btn-cancel" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="edit-btn-submit" type="submit" disabled={busy}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="edit-confirm-overlay"
          onClick={() => !deleting && setShowDeleteConfirm(false)}
        >
          <div className="edit-confirm-box" onClick={e => e.stopPropagation()}>
            <h3 className="edit-confirm-title">Delete this post?</h3>
            <p className="edit-confirm-text">
              Are you sure you want to delete{post.animalName ? ` "${post.animalName}"` : ' this post'}?
              This action cannot be undone.
            </p>
            <div className="edit-confirm-actions">
              <button
                className="edit-btn-cancel"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="edit-btn-delete"
                type="button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  )

}