import { useState } from 'react'
import { getToken } from '../utils/auth'
import "../styles/Post.css";

export default function Post({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    idAnimal: '',
    description: '',
    status: 'ACTIVE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.idAnimal) {
      setError('El ID del animal es obligatorio.')
      return
    }

    setLoading(true)
    try {
      const token = getToken()
      const response = await fetch('http://localhost:8080/post/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idAnimal: parseInt(formData.idAnimal),
          description: formData.description || null,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        setError('No se pudo crear la publicación. Verifica el ID del animal.')
        return
      }

      const data = await response.json()
      onSuccess?.(data)
      onClose?.()
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
  <form className="post-form" onSubmit={handleSubmit}>

    <div className="post-form-group">
      <label className="post-form-label">Animal ID *</label>
      <input
        className="post-form-input"
        type="number"
        name="idAnimal"
        placeholder="e.g. 3"
        value={formData.idAnimal}
        onChange={handleChange}
        min={1}
      />
    </div>

    <div className="post-form-group">
      <label className="post-form-label">Description</label>
      <textarea
        className="post-form-textarea"
        name="description"
        placeholder="Tell us about this animal..."
        value={formData.description}
        onChange={handleChange}
      />
    </div>

    <div className="post-form-group">
      <label className="post-form-label">Status</label>
      <select
        className="post-form-select"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>

    {error && <p className="post-form-error">{error}</p>}

    <div className="post-form-actions">
      <button
        className="post-btn-cancel"
        type="button"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className="post-btn-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Publishing...' : 'Publish'}
      </button>
    </div>

  </form>
)
}