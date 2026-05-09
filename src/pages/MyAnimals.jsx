import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function MyAnimals() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '32px', flex: 1 }}>
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