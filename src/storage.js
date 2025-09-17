/**
 * Storage utilities for persisting Kanban board data using localStorage
 */

const STORAGE_KEY = 'kanban-tasks';

/**
 * Default tasks structure for initialization
 */
const DEFAULT_TASKS = {
  todo: [],
  'in-progress': [],
  done: []
};

/**
 * Loads tasks from localStorage
 * @returns {Object} Tasks organized by status
 */
export function loadTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) {
      return { ...DEFAULT_TASKS };
    }

    const parsedTasks = JSON.parse(storedTasks);

    // Validate structure and provide defaults for missing properties
    return {
      todo: Array.isArray(parsedTasks.todo) ? parsedTasks.todo : [],
      'in-progress': Array.isArray(parsedTasks['in-progress']) ? parsedTasks['in-progress'] : [],
      done: Array.isArray(parsedTasks.done) ? parsedTasks.done : []
    };
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    // Return default structure if there's an error
    return { ...DEFAULT_TASKS };
  }
}

/**
 * Saves tasks to localStorage
 * @param {Object} tasks - Tasks object to save
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
    // Could show user notification here if storage fails
  }
}

/**
 * Adds a new task to the specified status column
 * @param {string} status - Task status ('todo', 'in-progress', 'done')
 * @param {Object} task - Task object to add
 * @returns {Object} Updated tasks object
 */
export function addTask(status, task) {
  const tasks = loadTasks();

  if (!tasks[status]) {
    console.error(`Invalid status: ${status}`);
    return tasks;
  }

  tasks[status].push(task);
  saveTasks(tasks);

  return tasks;
}

/**
 * Updates a task's status (moves between columns)
 * @param {string} taskId - ID of the task to update
 * @param {string} newStatus - New status for the task
 * @returns {Object} Updated tasks object
 */
export function updateTaskStatus(taskId, newStatus) {
  const tasks = loadTasks();

  // Find and remove task from current status
  let taskToMove = null;
  let currentStatus = null;

  for (const [status, taskList] of Object.entries(tasks)) {
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      taskToMove = taskList.splice(taskIndex, 1)[0];
      currentStatus = status;
      break;
    }
  }

  if (!taskToMove) {
    console.error(`Task with ID ${taskId} not found`);
    return tasks;
  }

  // Add task to new status
  if (!tasks[newStatus]) {
    console.error(`Invalid new status: ${newStatus}`);
    return tasks;
  }

  // Update task's status and timestamp
  taskToMove.status = newStatus;
  taskToMove.updatedAt = new Date().toISOString();

  tasks[newStatus].push(taskToMove);
  saveTasks(tasks);

  return tasks;
}

/**
 * Deletes a task by ID
 * @param {string} taskId - ID of the task to delete
 * @returns {Object} Updated tasks object
 */
export function deleteTask(taskId) {
  const tasks = loadTasks();

  for (const [status, taskList] of Object.entries(tasks)) {
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      taskList.splice(taskIndex, 1);
      saveTasks(tasks);
      break;
    }
  }

  return tasks;
}

/**
 * Updates an existing task
 * @param {string} taskId - ID of the task to update
 * @param {Object} updates - Properties to update
 * @returns {Object} Updated tasks object
 */
export function updateTask(taskId, updates) {
  const tasks = loadTasks();

  for (const [status, taskList] of Object.entries(tasks)) {
    const task = taskList.find(task => task.id === taskId);
    if (task) {
      Object.assign(task, updates);
      task.updatedAt = new Date().toISOString();
      saveTasks(tasks);
      break;
    }
  }

  return tasks;
}

/**
 * Clears all tasks from storage (useful for testing or reset)
 */
export function clearAllTasks() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tasks from localStorage:', error);
  }
}

/**
 * Gets task statistics
 * @returns {Object} Statistics about tasks
 */
export function getTaskStats() {
  const tasks = loadTasks();

  const stats = {
    total: 0,
    todo: 0,
    'in-progress': 0,
    done: 0
  };

  Object.entries(tasks).forEach(([status, taskList]) => {
    stats[status] = taskList.length;
    stats.total += taskList.length;
  });

  return stats;
}
