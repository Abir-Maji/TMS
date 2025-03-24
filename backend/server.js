// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db'); 
// const taskRoutes = require('./routes/taskRoutes');
// const employeeRoutes = require('./routes/employeeController');
// const employeeTaskRoutes = require('./routes/employeeTaskRoutes');

// dotenv.config();

// // Initialize Express app
// const app = express();

// // Enable CORS
// app.use(cors());

// // Parse JSON bodies
// app.use(express.json());

// // Connect to MongoDB
// connectDB(); // Ensure this is called before defining routes

// // Routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);
// app.use('/employee', require('./routes/employee'));
// app.use('/tasks', taskRoutes);
// app.use('/employee', employeeRoutes);
// app.use('/api/employee/tasks', employeeTaskRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Server Error:', err.stack);
//     res.status(500).json({ message: 'Internal Server Error' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const taskRoutes = require('./routes/taskRoutes');
const employeeController = require('./routes/employeeController');
const employeeTaskRoutes = require('./routes/employeeTaskRoutes');
const employeeRoutess = require('./routes/employeeRoutes');

const adminCollaboratorsRoutes = require('./routes/admincollaborators');
const employeeCollaboratorsRoutes = require('./routes/employeecollaborators');


const employeeRoutes = require('./routes/employee');

dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB(); // Ensure this is called before defining routes

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/employee', require('./routes/employee'));
app.use('/tasks', taskRoutes);
app.use('/employee', employeeController);
app.use('/api/employee/tasks', employeeTaskRoutes);
app.use('/api/employee', employeeRoutess);
app.use('/api/admin', adminCollaboratorsRoutes); 
app.use('/api', employeeCollaboratorsRoutes);


app.use('/api/employee', employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});