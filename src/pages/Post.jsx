import { useState } from 'react'
import { getToken } from '../utils/auth'

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
    <form onSubmit={handleSubmit}>

      <div>
        <label>Animal's ID *</label>
        <input
          type="number"
          name="idAnimal"
          placeholder="Ej. 3"
          value={formData.idAnimal}
          onChange={handleChange}
          min={1}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Cuéntanos sobre este animal..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div>
        <label>STATUS</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      <div>
        <button type="button" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </div>

    </form>
  )
}