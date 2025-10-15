import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

interface TaskBoardProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      onTaskUpdate(editingTask.id, taskData);
    } else {
      onTaskCreate(taskData);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    onTaskUpdate(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Task Board</h2>
          <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateTask}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Task</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${column.color} rounded-xl p-4 min-h-[500px]`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="bg-white bg-opacity-70 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {getTasksByStatus(column.id).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => onTaskDelete(task.id)}
                    onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showTaskModal && (
          <TaskModal
            task={editingTask}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
            onSubmit={handleTaskSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskBoard;