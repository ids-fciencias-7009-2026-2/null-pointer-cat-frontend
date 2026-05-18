import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Sidebar.css'
import { BiUser, BiLogOut, BiNews, BiBone } from 'react-icons/bi'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  const handleLogout = () => {
    navigate('/logout')
    setIsOpen(false)
  }

  return (
    <>
      <button
        className={`hamburger-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h1>AdoptaPet</h1>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li>
              <button className="sidebar-menu-item" onClick={() => handleNavigate('/profile')}>
                <BiUser />
                Profile
              </button>
            </li>
            <li>
              <button className="sidebar-menu-item" onClick={() => handleNavigate('/my-posts')}>
                <BiNews />
                My posts
              </button>
            </li>
            <li>
              <button className="sidebar-menu-item" onClick={() => handleNavigate('/my-posts')}>
                <BiBone />
                My Animals
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-footer-button logout" onClick={handleLogout}>
            <BiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}