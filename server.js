const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = require('./app');
const http = require('http');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/myapp';

const port = process.env.PORT || 3777;
app.set('port', port);

app.use(require('cors')());
app.use(express.json());

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join ห้องด้วย userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Chat — ส่งข้อความไปยัง user คนหนึ่ง
  socket.on('send-message', ({ to, from, message }) => {
    io.to(to).emit('receive-message', { from, message, time: new Date() });
  });

  // Broadcast notification ไปทุกคน
  socket.on('broadcast', (data) => {
    socket.broadcast.emit('notification', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Export io เพื่อใช้ใน routes
app.set('io', io);

server.listen(port, () => console.log(`Server is running on port ${port}`));
server.on('error', err => { console.error(err); process.exit(1); });

mongoose.connect(dbUrl)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



