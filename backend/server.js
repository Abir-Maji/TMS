const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Task = require('./models/Task'); // Import Task model for migration

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

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB().then(async () => {
  // Optional: Run task migration if needed
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
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/control', employeeController);
app.use('/api/employee/tasks', employeeTaskRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminCollaboratorsRoutes);
app.use('/api/collaborators', employeeCollaboratorsRoutes);
app.use('/api/register', employeeRegister);
app.use('/api/fetch', fetchRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Error Handling Middleware
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
// Debug route - REMOVE AFTER TROUBLESHOOTING
app.post('/api/debug/task', (req, res) => {
  console.log('Received task data:', {
    body: req.body,
    headers: req.headers,
    rawBody: req.rawBody
  });
  res.json({ received: true });
});


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});