const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Task = require('./models/Task');
const session = require('express-session');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Route imports
const taskRoutes = require('./routes/taskRoutes');
const employeeController = require('./routes/employeeController');
const employeeTaskRoutes = require('./routes/employeeTaskRoutes');
const adminCollaboratorsRoutes = require('./routes/admincollaborators');
const employeeCollaboratorsRoutes = require('./routes/employeecollaborators');
const employeeRoutes = require('./routes/employeeRoutes');
const employeeRegister = require('./routes/employee');
const fetchRoutes = require('./routes/taskFetch');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);

// Configure CORS based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_PROD_URL]
  : ['http://localhost:5173'];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Set mongoose strictQuery
mongoose.set('strictQuery', false);

// Configure session store with error handling
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60,
  autoRemove: 'native',
  crypto: {
    secret: process.env.SESSION_SECRET
  }
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Database Connection with retry logic
connectDB().then(async () => {
  // Session Configuration (AFTER successful DB connection)
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
      }
    })
  );

  // Make store available to routes
  app.locals.store = store;

  // WebSocket Setup
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  // Store connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected via WebSocket');
    
    // Handle user registration (store their socket ID)
    socket.on('register-user', ({ userId, userType }) => {
      connectedUsers.set(`${userType}-${userId}`, socket.id);
      console.log(`User registered: ${userType}-${userId}`);
    });

    // Handle task updates
    socket.on('task-updated', (taskId) => {
      io.emit('refresh-tasks', taskId);
    });

    // Handle messaging
    socket.on('send-message', (message) => {
      const receiverKey = `${message.receiverModel}-${message.receiver}`;
      const receiverSocketId = connectedUsers.get(receiverKey);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', message);
      }
      
      // Also send to sender for their own UI update
      const senderKey = `${message.senderModel}-${message.sender}`;
      const senderSocketId = connectedUsers.get(senderKey);
      if (senderSocketId) {
        io.to(senderSocketId).emit('new-message', message);
      }
    });

    socket.on('disconnect', () => {
      // Remove user from connected users map
      for (const [key, value] of connectedUsers.entries()) {
        if (value === socket.id) {
          connectedUsers.delete(key);
          console.log(`User disconnected: ${key}`);
          break;
        }
      }
    });
  });

  // Make io accessible to routes
  app.set('io', io);

  // Task Migration (if needed)
  if (process.env.RUN_TASK_MIGRATION === 'true') {
    try {
      console.log('Starting task migration...');
      const tasks = await Task.find({ users: { $type: 'array' } });
      let migratedCount = 0;
      for (const task of tasks) {
        task.users = task.users.join(', ');
        await task.save();
        migratedCount++;
      }
      console.log(`Migration complete. Updated ${migratedCount} tasks.`);
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/control', employeeController);
  app.use('/api/employee/tasks', employeeTaskRoutes);
  app.use('/api/employee', employeeRoutes);
  app.use('/api/admin', adminCollaboratorsRoutes);
  app.use('/api/collaborators', employeeCollaboratorsRoutes);
  app.use('/api/register', employeeRegister);
  app.use('/api/fetch', fetchRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/notifications', notificationRoutes);

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected:', mongoose.connection.host);
  });

  // Health Check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  });

  // Error Handling
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({ 
      message: 'Route not found',
      path: req.path,
      method: req.method
    });
  });

  // Debug Route
  app.post('/api/debug/task', (req, res) => {
    console.log('Received task data:', {
      body: req.body,
      headers: req.headers
    });
    res.json({ received: true });
  });

  // Start Server
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`
      Server running in ${process.env.NODE_ENV || 'development'} mode
      Listening on port ${PORT}
      MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
      CORS allowed origins: ${allowedOrigins.join(', ')}
    `);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});