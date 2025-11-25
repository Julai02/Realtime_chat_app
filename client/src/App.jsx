import { useState, useEffect } from 'react'
import { useSocket } from './socket/socket'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import './App.css'

export default function App() {
  const { isConnected, connect, disconnect } = useSocket()
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (name) => {
    setUsername(name)
    connect(name)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    disconnect()
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <ChatPage username={username} onLogout={handleLogout} />
      )}
    </div>
  )
}
