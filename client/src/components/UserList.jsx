import '../styles/UserList.css'

export default function UserList({ users, currentUser, onSelectUser, selectedUser }) {
  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p className="no-users">No users online</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${user.username === currentUser ? 'current' : ''} ${selectedUser?.username === user.username ? 'selected' : ''}`}
            onClick={() => user.username !== currentUser && onSelectUser(user)}
          >
            <span className="user-status">●</span>
            <span className="user-name">{user.username}</span>
            {user.username === currentUser && <span className="you-badge">You</span>}
          </div>
        ))
      )}
    </div>
  )
}
