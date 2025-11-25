import { useState, useRef, useEffect } from 'react'
import '../styles/MessageInput.css'

export default function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('')
  const typingTimeoutRef = useRef(null)

  const handleChange = (e) => {
    setMessage(e.target.value)
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Emit typing event
    onTyping(true)

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false)
    }, 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
      onTyping(false)
    }
  }

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </div>
    </form>
  )
}
