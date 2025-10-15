const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tasksFile = path.join(__dirname, '../data/tasks.json');

const getTasks = async () => {
  try {
    return await fs.readJson(tasksFile);
  } catch (error) {
    return [];
  }
};

const saveTasks = async (tasks) => {
  await fs.writeJson(tasksFile, tasks, { spaces: 2 });
};

const getUserTasks = async (userId) => {
  const tasks = await getTasks();
  return tasks.filter(task => task.userId === userId);
};

const createTask = async (taskData, userId) => {
  const tasks = await getTasks();
  
  const newTask = {
    id: uuidv4(),
    ...taskData,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
};

const updateTask = async (taskId, updates, userId) => {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === userId);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveTasks(tasks);
  return tasks[taskIndex];
};

const deleteTask = async (taskId, userId) => {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === userId);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  tasks.splice(taskIndex, 1);
  await saveTasks(tasks);
  return true;
};

const findTaskById = async (taskId, userId) => {
  const tasks = await getTasks();
  return tasks.find(task => task.id === taskId && task.userId === userId);
};

module.exports = {
  getTasks,
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  findTaskById,
};