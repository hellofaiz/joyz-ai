/**
 * Main entry point for the Dynamic Kanban Board application
 */

import { KanbanBoard } from './kanban.js';
import './index.css';

/**
 * Application initialization
 */
function initApp() {
  try {
    // Initialize the Kanban board
    const kanbanBoard = new KanbanBoard();

    // Add some example tasks if the board is empty (for demo purposes)
    const tasks = kanbanBoard.getTasks();
    const totalTasks = Object.values(tasks).reduce((sum, list) => sum + list.length, 0);

    if (totalTasks === 0) {
      // Add example tasks to demonstrate functionality
      addExampleTasks(kanbanBoard);
    }

    console.log('Dynamic Kanban Board initialized successfully!');

  } catch (error) {
    console.error('Failed to initialize Kanban Board:', error);
    // Could show a user-friendly error message here
  }
}

/**
 * Adds example tasks for demonstration
 * @param {KanbanBoard} kanbanBoard - The Kanban board instance
 */
function addExampleTasks(kanbanBoard) {
  const exampleTasks = [
    {
      id: 'example-1',
      title: 'Welcome to Dynamic Kanban!',
      description: 'This is an example task in the To Do column. Drag me to another column or delete me.',
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'example-2',
      title: 'Build user authentication',
      description: 'Implement login and registration functionality with secure password hashing.',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString()
    },
    {
      id: 'example-3',
      title: 'Deploy to production',
      description: 'Set up CI/CD pipeline and deploy the application to the production environment.',
      status: 'done',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date().toISOString()
    }
  ];

  // Add example tasks to the board
  exampleTasks.forEach(task => {
    // Use the board's internal addTask method by directly calling the storage function
    // This is a bit of a workaround since we want to add multiple tasks at once
    import('./storage.js').then(({ addTask }) => {
      addTask(task.status, task);
    });
  });

  // Refresh the board after adding example tasks
  setTimeout(() => {
    kanbanBoard.refresh();
  }, 100);
}

/**
 * Handles page load and initializes the application
 */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * Handles page visibility changes (useful for refreshing data)
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page became visible again, could refresh data if needed
    console.log('Page became visible');
  }
});

/**
 * Global error handler for unhandled errors
 */
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Could show user notification for critical errors
});

/**
 * Global handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Could show user notification for critical errors
});
