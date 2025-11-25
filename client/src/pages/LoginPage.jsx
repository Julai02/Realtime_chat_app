import { useState } from 'react'
import '../styles/LoginPage.css'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    onLogin(username.trim())
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">💬 Real-Time Chat</h1>
        <p className="login-subtitle">Join the conversation now</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              className="login-input"
              autoFocus
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Join Chat
          </button>
        </form>

        <div className="login-features">
          <h3>Features:</h3>
          <ul>
            <li>✓ Real-time messaging</li>
            <li>✓ Typing indicators</li>
            <li>✓ Private messages</li>
            <li>✓ User status</li>
            <li>✓ Message reactions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
