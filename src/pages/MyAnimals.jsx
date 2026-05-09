import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function MyAnimals() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '32px', flex: 1 }}>
        <button
          onClick={() => navigate('/home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-strong)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px', padding: 0 }}
        >
          ← Back to Home
        </button>
        <h1>My Animals</h1>
        <button
          className="home-publish-btn"
          onClick={() => navigate('/register-animal')}
        >
          + Register animal
        </button>
      </div>
    </div>
  )
}