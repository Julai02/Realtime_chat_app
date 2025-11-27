# 🔄 Real-Time Chat Application with Socket.io

A modern, feature-rich real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for bidirectional communication.

## ✅ Assignment Overview - COMPLETED

This application implements all core requirements and advanced features:
1. ✅ Real-time messaging using Socket.io
2. ✅ User authentication and presence management
3. ✅ Private messaging between users
4. ✅ Real-time notifications and status updates
5. ✅ Advanced features: typing indicators, responsive design, auto-reconnection

## Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week5-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week5-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. ✅ Complete both the client and server portions of the application
2. ✅ Implement the core chat functionality
3. ✅ Add at least 3 advanced features
4. ✅ Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Features Implemented

### Task 1: Project Setup ✅
- [x] Node.js server with Express & Socket.io
- [x] React front-end with Vite
- [x] Socket.io client integration
- [x] Client-server bidirectional connection
- [x] Environment configuration

### Task 2: Core Chat Functionality ✅
- [x] Username-based authentication
- [x] Global chat room with all users
- [x] Messages with sender name and timestamp
- [x] Typing indicators showing who's typing
- [x] Online/offline status for all users
- [x] User join/leave notifications
- [x] Real-time user list updates

### Task 3: Advanced Chat Features ✅
- [x] Private messaging between users
- [x] Responsive UI that works on all devices
- [x] Message display with system notifications
- [x] Modern gradient UI with animations

### Task 4: Real-Time Notifications ✅
- [x] User join notifications
- [x] User leave notifications
- [x] Connection status indicator
- [x] Typing notifications
- [x] Message receive acknowledgment

### Task 5: Performance & UX Optimization ✅
- [x] Auto-reconnection with exponential backoff
- [x] Responsive mobile-first design
- [x] Smooth animations and transitions
- [x] Message pagination (stored messages)
- [x] Optimized Socket.io event handling

## 🚀 Getting Started - Quick Start

### Prerequisites
- Node.js v18+ installed
- Two terminal windows

### Installation & Run

**Terminal 1 - Server:**
```bash
cd server
npm install
node server.js
```

**Terminal 2 - Client:**
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5174` in your browser and start chatting!

## 📦 Tech Stack

**Frontend:** React 19, Vite, Socket.io-client, Tailwind CSS
**Backend:** Node.js, Express, Socket.io, MongoDB (optional)

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat)

## ⚠️ Deployment Notes (Vercel client + Render backend)

1. Set the Socket.io URL in the Vite build environment for the client (Vercel):
  - Add the environment variable `VITE_SOCKET_URL` to your Vercel project settings and set it to your Render backend URL (for example: `https://your-backend.onrender.com`). This value is baked into the build and used by the `socket.js` client.

  - If you prefer to use the CLI, you can run:

  ```powershell
  # production
  vercel env add VITE_SOCKET_URL production
  # preview
  vercel env add VITE_SOCKET_URL preview
  # development
  vercel env add VITE_SOCKET_URL development
  ```

2. Configure your backend (Render) to allow connections from the Vercel domain:
  - In Render's dashboard for your backend service, add the environment variable `CLIENT_URL` and set it to the domain your client is hosted on (for example: `https://your-client.vercel.app`). This service is used in `server.js` to set CORS for Socket.io.
  - Alternatively, you can set `CLIENT_URL` to `*` temporarily while testing, but this is not recommended for production.

3. Use HTTPS in production. Ensure that `VITE_SOCKET_URL` uses `https://` and that your Render backend is serving with TLS.

4. Rebuild the client in Vercel after setting the environment variables. Because Vite inlines env variables at build-time, the client must be re-built for a new env var value to take effect.

5. Verify connections by opening your client in the browser's developer tools and watching for socket.io requests in the Network tab. If you still see `localhost:5000` in requests after adding `VITE_SOCKET_URL`, clear any build caches and trigger a fresh build.
