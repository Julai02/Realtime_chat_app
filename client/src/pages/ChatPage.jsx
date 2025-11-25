import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../socket/socket'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import UserList from '../components/UserList'
import TypingIndicator from '../components/TypingIndicator'
import { sendNotification, playNotificationSound, requestNotificationPermission } from '../utils/notification'
import '../styles/ChatPage.css'

export default function ChatPage({ username, onLogout }) {
  const { 
    messages, 
    users, 
    typingUsers, 
    sendMessage,
    addReaction,
    removeReaction,
    setTyping,
    isConnected 
  } = useSocket()
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Show notification for new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only notify if it's not from current user and not a system message
      if (lastMessage.sender !== username && !lastMessage.system) {
        playNotificationSound();
        sendNotification(`New message from ${lastMessage.sender}`, {
          body: lastMessage.message.substring(0, 100),
          tag: 'new-message',
          requireInteraction: false,
        });
      }
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (messageText) => {
    if (messageText.trim()) {
      sendMessage(messageText)
      setTyping(false)
    }
  }

  const handleTyping = (isTyping) => {
    setTyping(isTyping)
  }

  const filteredMessages = selectedUser
    ? messages.filter(msg => 
        msg.sender === selectedUser.username || msg.sender === username
      )
    : messages.filter(msg => !msg.system || msg.message.includes('left') || msg.message.includes('joined'))

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        {/* Sidebar */}
        <div className={`sidebar ${showUserList ? 'show' : ''}`}>
          <div className="sidebar-header">
            <h2>Users Online</h2>
            <button 
              className="close-btn"
              onClick={() => setShowUserList(false)}
            >
              ✕
            </button>
          </div>
          
          <UserList 
            users={users} 
            currentUser={username}
            onSelectUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        </div>

        {/* Main Chat Area */}
        <div className="main-chat">
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <h1>
                {selectedUser ? `Chat with ${selectedUser.username}` : 'Global Chat'}
              </h1>
              <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '● Connected' : '● Disconnected'}
              </span>
            </div>
            
            <div className="header-right">
              <button 
                className="users-toggle"
                onClick={() => setShowUserList(!showUserList)}
              >
                👥 Users ({users.length})
              </button>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <MessageList 
                messages={filteredMessages}
                currentUser={username}
                onAddReaction={addReaction}
                onRemoveReaction={removeReaction}
              />
            )}
            {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <MessageInput 
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            currentUser={username}
          />
        </div>
      </div>
    </div>
  )
}
