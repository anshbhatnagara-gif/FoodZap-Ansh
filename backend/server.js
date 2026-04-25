/**
 * FoodZap Backend Server
 * Main entry point for the Food & Grocery Delivery Platform
 */

require('dotenv').config();

const express = require('express');
const { db } = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const paymentRoutes = require('./routes/payment.routes');
const aiRoutes = require('./routes/ai.routes');
const locationRoutes = require('./routes/location.routes');
const adminRoutes = require('./routes/admin.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const groceryRoutes = require('./routes/grocery.routes');
const notificationRoutes = require('./routes/notification.routes');
const walletRoutes = require('./routes/wallet.routes');
const loyaltyRoutes = require('./routes/loyalty.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Security middleware
app.use(helmet());
app.use(limiter);
app.use(compression());

// CORS configuration - Allow multiple origins for development
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:55023",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:55023",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// MySQL Database connection
db.testConnection().then(connected => {
  if (!connected) {
    console.error('Failed to connect to MySQL. Exiting...');
    process.exit(1);
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join room for order tracking
  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Socket ${socket.id} joined order-${orderId}`);
  });
  
  // Join room for delivery partner location
  socket.on('join-delivery', (deliveryId) => {
    socket.join(`delivery-${deliveryId}`);
  });
  
  // Update location (for delivery partners)
  socket.on('update-location', (data) => {
    const { orderId, latitude, longitude } = data;
    io.to(`order-${orderId}`).emit('location-update', {
      latitude,
      longitude,
      timestamp: new Date()
    });
  });
  
  // Order status updates
  socket.on('order-status-update', (data) => {
    const { orderId, status } = data;
    io.to(`order-${orderId}`).emit('status-change', {
      orderId,
      status,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FoodZap API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🍕 FoodZap Server Running on Port ${PORT}        ║
║                                                   ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(28)}║
║   Database: MySQL                                 ║
║   WebSocket: Enabled                              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = { app, io };
