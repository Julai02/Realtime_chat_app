// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};
const messageReactions = {}; // Store reactions: { messageId: { emoji: count } }
const readReceipts = {}; // Store read status: { messageId: { userId: timestamp } }

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send previous messages to new user
  socket.emit('load_messages', messages);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      reactions: {},
    };
    
    messages.push(message);
    messageReactions[message.id] = {};
    
    // Limit stored messages to prevent memory issues
    if (messages.length > 100) {
      const oldestMsg = messages.shift();
      delete messageReactions[oldestMsg.id];
      delete readReceipts[oldestMsg.id];
    }
    
    io.emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle message reactions
  socket.on('add_reaction', ({ messageId, emoji }) => {
    if (!messageReactions[messageId]) {
      messageReactions[messageId] = {};
    }
    
    const reactions = messageReactions[messageId];
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    
    // Update message in array
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      msg.reactions = reactions;
    }
    
    io.emit('reaction_added', { messageId, emoji, count: reactions[emoji] });
  });

  // Handle removing reactions
  socket.on('remove_reaction', ({ messageId, emoji }) => {
    if (messageReactions[messageId] && messageReactions[messageId][emoji]) {
      messageReactions[messageId][emoji]--;
      
      if (messageReactions[messageId][emoji] <= 0) {
        delete messageReactions[messageId][emoji];
      }
      
      // Update message in array
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
        msg.reactions = messageReactions[messageId];
      }
      
      io.emit('reaction_removed', { 
        messageId, 
        emoji, 
        count: messageReactions[messageId][emoji] || 0 
      });
    }
  });

  // Handle read receipts
  socket.on('mark_read', ({ messageId }) => {
    if (!readReceipts[messageId]) {
      readReceipts[messageId] = {};
    }
    
    readReceipts[messageId][socket.id] = new Date().toISOString();
    
    // Emit to sender that message was read
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      socket.to(msg.senderId).emit('message_read', { 
        messageId, 
        userId: socket.id,
        reader: users[socket.id]?.username 
      });
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
      reactions: {},
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 