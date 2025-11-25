import { useState } from 'react'
import '../styles/MessageList.css'

export default function MessageList({ messages, currentUser, onAddReaction, onRemoveReaction }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏']

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleEmojiClick = (messageId, emoji) => {
    onAddReaction(messageId, emoji)
    setShowEmojiPicker(null)
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`message ${message.sender === currentUser ? 'sent' : 'received'} ${message.system ? 'system' : ''}`}
          onMouseEnter={() => !message.system && setShowEmojiPicker(message.id)}
          onMouseLeave={() => setShowEmojiPicker(null)}
        >
          {message.system ? (
            <div className="system-message">
              <p>{message.message}</p>
            </div>
          ) : (
            <>
              <div className="message-header">
                <span className="sender-name">{message.sender}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-content">
                <p>{message.message}</p>
              </div>
              {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className="message-reactions">
                  {Object.entries(message.reactions).map(([emoji, count]) => (
                    <span 
                      key={emoji} 
                      className="reaction"
                      onClick={() => onRemoveReaction(message.id, emoji)}
                      title="Click to remove reaction"
                    >
                      {emoji} {count}
                    </span>
                  ))}
                </div>
              )}
              {showEmojiPicker === message.id && (
                <div className="emoji-picker">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="emoji-btn"
                      onClick={() => handleEmojiClick(message.id, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
