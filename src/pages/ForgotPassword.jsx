import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/api'
import '../styles/Login.css'

export default function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email.'); return }
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError('Connection error. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-image-side" />
      <div className="login-form-side">
        <div className="login-container">
          <h1 className="login-logo" />
          <h2 className="login-title">Forgot password</h2>

          {sent ? (
            <>
              <p style={{ color: '#33a366', background: 'rgba(51,163,102,0.1)',
                          padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                If that email is registered, a reset link has been sent. Check your inbox.
              </p>
              <Link to="/login" className="login-button"
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none', color: 'white' }}>
                Back to login
              </Link>
            </>
          ) : (
            <>
              {error && <p className="login-error">{error}</p>}
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="login-button" onClick={handleSubmit}>
                Send reset link
              </button>
              <p className="login-footer">
                <Link to="/login">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}