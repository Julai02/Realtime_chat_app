import '../styles/TypingIndicator.css'

export default function TypingIndicator({ users }) {
  const typingText = users.length === 1 
    ? `${users[0]} is typing`
    : `${users.length} users are typing`

  return (
    <div className="typing-indicator">
      <p>{typingText}</p>
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
