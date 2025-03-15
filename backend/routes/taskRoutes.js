// const express = require('express');
// const Task = require('../models/Task');

// const router = express.Router();

// // Create a new task
// router.post('/', async (req, res) => {
//   try {
//     const { title, description, currentDate, deadline, priority, team, user } = req.body;

//     // Validate input data
//     if (!title || !description || !currentDate || !deadline || !priority || !team || !user) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Create a new task
//     const newTask = new Task({
//       title,
//       description,
//       currentDate,
//       deadline,
//       priority,
//       team,
//       user,
//     });

//     // Save the task to the database
//     await newTask.save();

//     // Send success response
//     res.status(201).json({ message: 'Task created successfully', task: newTask });
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ message: 'An error occurred while creating the task' });
//   }
// });

// // Get all tasks
// router.get('/', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.status(200).json(tasks);
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ message: 'An error occurred while fetching tasks' });
//   }
// });

// module.exports = router;


const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');


const router = express.Router();

// POST /tasks - Create a new task
router.post('/', createTask);

// GET /tasks - Fetch all tasks
router.get('/', getTasks);

// PUT /tasks/:id - Update a task
router.put('/:id', updateTask);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', deleteTask);


module.exports = router;