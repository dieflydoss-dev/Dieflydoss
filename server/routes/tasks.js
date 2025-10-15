const express = require('express');
const { 
  getUserTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  findTaskById 
} = require('../models/Task');

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskData = {
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
      assignedTo: '',
    };

    const newTask = await createTask(taskData, req.user.id);

    // Emit real-time update
    req.io.to(`user-${req.user.id}`).emit('task-created', newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;

    const updatedTask = await updateTask(id, updates, req.user.id);

    // Emit real-time update
    req.io.to(`user-${req.user.id}`).emit('task-updated', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await deleteTask(id, req.user.id);

    // Emit real-time update
    req.io.to(`user-${req.user.id}`).emit('task-deleted', { id });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await findTaskById(id, req.user.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

module.exports = router;