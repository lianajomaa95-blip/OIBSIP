require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = express();
connectDB();
// Create HTTP server (needed for Socket.io)
const server = http.createServer(app);
// Set up Socket.io with CORS for the frontend
const io = new Server(server, {
cors: {
origin: process.env.CLIENT_URL || 'http://localhost:5173',
methods: ['GET', 'POST', 'PUT'],
},
});
// Make io accessible in controllers via req.app.get('io')
app.set('io', io);
// Socket.io connection handler
io.on('connection', (socket) => {
console.log('🔌 Client connected:', socket.id);
// User joins a room based on their user ID (so we can send them targeted updates)
socket.on('join', (userId) => {
socket.join(userId);
console.log(`User ${userId} joined their room`);
});
socket.on('disconnect', () => {
console.log('🔌 Client disconnected:', socket.id);
});
});
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ingredients', require('./routes/ingredientRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.get('/', (req, res) => {
res.json({ message: 'Pizza Delivery API is running 🍕' });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
console.log(`Server running in development mode on port ${PORT}`);
});
