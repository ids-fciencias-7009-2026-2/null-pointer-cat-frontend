import { useState, useEffect } from 'react'
import { getToken } from '../utils/auth'
import "../styles/Post.css";
import { getMyAnimals, registerPost } from '../services/api'

export default function Post({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    idAnimal: '',
    description: '',
    status: 'ACTIVE',
  })
  const [animals, setAnimals] = useState([])
  const [loadingAnimals, setLoadingAnimals] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {

      const response = await getMyAnimals()
      if (!response.ok) {
        setError('Could not load animals.')
        return
      }

      const data = await response.json()
      setAnimals(data)
    } catch (err) {
      setError('Connection error while loading animals.')
    } finally {
      setLoadingAnimals(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.idAnimal || isNaN(parseInt(formData.idAnimal, 10))) {
      setError('You must select an animal.')
      return
    }

    setLoading(true)
    try {
      const response = await registerPost({
        idAnimal: parseInt(formData.idAnimal, 10),
        description: formData.description || null,
        status: formData.status,
      })
      if (!response.ok) {
        setError('Error with publication')
        return
      }
      const data = await response.json()
      onSuccess?.(data)
      onClose?.()
    } catch (err) {
      setError('Connection error...')
    } finally {
      setLoading(false)
    }
  }

  return (
  <form className="post-form" onSubmit={handleSubmit}>

      <div className="post-form-group">
        <label className="post-form-label">Animal ID *</label>
        {loadingAnimals ? (
          <p className="post-form-loading">Loading animals...</p>
        ) : (
          <select
            className="post-form-select"
            name="idAnimal"
            value={formData.idAnimal}
            onChange={handleChange}
          >
            <option value="">Select an animal</option>
            {animals.map((animal) => (
              <option key={animal.idAnimal} value={animal.idAnimal}>
                {animal.animalName}
              </option>
            ))}
          </select>
        )}
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