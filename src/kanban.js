/**
 * Main Kanban board functionality
 */

import { createElement, getElementById, addEventListener, generateId, validateInput, showMessage } from './utils.js';
import { loadTasks, addTask, deleteTask, updateTask } from './storage.js';
import { initDragAndDrop, makeDraggable, refreshDragAndDrop } from './dragDrop.js';

/**
 * Kanban Board class for managing the entire board functionality
 */
export class KanbanBoard {
  constructor() {
    this.tasks = loadTasks();
    this.init();
  }

  /**
   * Initializes the Kanban board
   */
  init() {
    this.setupEventListeners();
    this.renderAllTasks();
    this.setupDragAndDrop();
  }

  /**
   * Sets up event listeners for the board
   */
  setupEventListeners() {
    // Add task button
    const addTaskBtn = getElementById('add-task-btn');
    addEventListener(addTaskBtn, 'click', () => this.handleAddTask());

    // Form submission on Enter key
    const taskTitleInput = getElementById('task-title');
    const taskDescriptionInput = getElementById('task-description');

    addEventListener(taskTitleInput, 'keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleAddTask();
      }
    });

    addEventListener(taskDescriptionInput, 'keypress', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.handleAddTask();
      }
    });

    // Handle task deletion (event delegation)
    addEventListener(document, 'click', (event) => {
      if (event.target.matches('.delete-task-btn') || event.target.closest('.delete-task-btn')) {
        const taskCard = event.target.closest('.task-card');
        const taskId = taskCard.dataset.taskId;
        this.handleDeleteTask(taskId);
      }
    }, '.delete-task-btn');
  }

  /**
   * Sets up drag and drop functionality
   */
  setupDragAndDrop() {
    initDragAndDrop((taskId, oldStatus, newStatus) => {
      // Optional: Show notification when task is moved
      showMessage(`Task moved to ${this.formatStatus(newStatus)}`, 'info', 2000);
    });
  }

  /**
   * Handles adding a new task
   */
  handleAddTask() {
    const titleInput = getElementById('task-title');
    const descriptionInput = getElementById('task-description');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    // Validate inputs
    if (!validateInput(title, { required: true, minLength: 1, maxLength: 100 })) {
      showMessage('Task title is required and must be less than 100 characters', 'error');
      return;
    }

    if (!validateInput(description, { required: false, maxLength: 500 })) {
      showMessage('Task description must be less than 500 characters', 'error');
      return;
    }

    // Create new task
    const newTask = {
      id: generateId(),
      title,
      description,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to storage
    this.tasks = addTask('todo', newTask);

    // Clear form
    titleInput.value = '';
    descriptionInput.value = '';

    // Render the new task
    this.renderTask(newTask);

    // Make it draggable
    const taskCard = document.querySelector(`[data-task-id="${newTask.id}"]`);
    if (taskCard) {
      makeDraggable(taskCard);
    }

    // Show success message
    showMessage('Task added successfully!', 'success');
  }

  /**
   * Handles deleting a task
   * @param {string} taskId - ID of the task to delete
   */
  handleDeleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      // Remove from DOM
      const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskCard) {
        taskCard.remove();
      }

      // Remove from storage
      this.tasks = deleteTask(taskId);

      showMessage('Task deleted successfully!', 'success');
    }
  }

  /**
   * Renders all tasks from storage
   */
  renderAllTasks() {
    // Clear existing tasks
    this.clearAllTaskLists();

    // Render tasks for each status
    Object.entries(this.tasks).forEach(([status, taskList]) => {
      taskList.forEach(task => {
        this.renderTask(task);
      });
    });

    // Make all task cards draggable
    refreshDragAndDrop();
  }

  /**
   * Renders a single task card
   * @param {Object} task - Task object to render
   */
  renderTask(task) {
    const taskCard = createElement('div', {
      className: 'task-card',
      'data-task-id': task.id
    });

    // Task header with title and delete button
    const taskHeader = createElement('div', { className: 'task-header' });

    const taskTitle = createElement('h3', {}, task.title);
    taskHeader.appendChild(taskTitle);

    // Delete button (subtle, appears on hover)
    const deleteBtn = createElement('button', {
      className: 'delete-task-btn',
      title: 'Delete task',
      'aria-label': 'Delete task'
    }, '×');

    Object.assign(deleteBtn.style, {
      background: 'transparent',
      border: 'none',
      color: '#e74c3c',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      opacity: '0',
      transition: 'opacity 0.3s',
      position: 'absolute',
      top: '10px',
      right: '10px'
    });

    taskCard.appendChild(deleteBtn);
    taskHeader.appendChild(taskTitle);

    // Add hover effect for delete button
    taskCard.addEventListener('mouseenter', () => {
      deleteBtn.style.opacity = '1';
    });

    taskCard.addEventListener('mouseleave', () => {
      deleteBtn.style.opacity = '0';
    });

    taskCard.appendChild(taskHeader);

    // Task description
    if (task.description) {
      const taskDescription = createElement('p', {}, task.description);
      taskCard.appendChild(taskDescription);
    }

    // Task metadata (optional: creation date)
    const taskMeta = createElement('div', { className: 'task-meta' });
    const createdDate = new Date(task.createdAt).toLocaleDateString();
    const metaText = createElement('small', {
      style: 'color: #95a5a6; font-size: 0.8em;'
    }, `Created: ${createdDate}`);

    taskMeta.appendChild(metaText);
    taskCard.appendChild(taskMeta);

    // Add to appropriate column
    const columnId = `${task.status}-list`;
    const targetList = getElementById(columnId);
    if (targetList) {
      targetList.appendChild(taskCard);
    }
  }

  /**
   * Clears all task lists
   */
  clearAllTaskLists() {
    const lists = ['todo-list', 'in-progress-list', 'done-list'];
    lists.forEach(listId => {
      const list = getElementById(listId);
      if (list) {
        list.innerHTML = '';
      }
    });
  }

  /**
   * Formats status for display
   * @param {string} status - Status string
   * @returns {string} Formatted status
   */
  formatStatus(status) {
    const statusMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    };
    return statusMap[status] || status;
  }

  /**
   * Gets current tasks data
   * @returns {Object} Current tasks
   */
  getTasks() {
    return { ...this.tasks };
  }

  /**
   * Refreshes the board (useful after external changes)
   */
  refresh() {
    this.tasks = loadTasks();
    this.renderAllTasks();
  }
}
