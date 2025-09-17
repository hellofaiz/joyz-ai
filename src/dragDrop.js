/**
 * Drag and Drop functionality for Kanban board
 */

import { updateTaskStatus } from './storage.js';

/**
 * Initializes drag and drop functionality for the Kanban board
 * @param {Function} onTaskMoved - Callback function when a task is moved
 */
export function initDragAndDrop(onTaskMoved) {
  // Get all task lists
  const taskLists = document.querySelectorAll('.task-list');

  taskLists.forEach(list => {
    setupDropZone(list);
  });

  // Set up drag events for existing and future task cards
  setupDragEvents();
}

/**
 * Sets up drop zone for a task list
 * @param {HTMLElement} listElement - The task list element
 */
function setupDropZone(listElement) {
  listElement.addEventListener('dragover', handleDragOver);
  listElement.addEventListener('dragleave', handleDragLeave);
  listElement.addEventListener('drop', handleDrop);
}

/**
 * Sets up drag events for task cards
 */
function setupDragEvents() {
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragend', handleDragEnd);
}

/**
 * Handles the start of a drag operation
 * @param {DragEvent} event - The drag event
 */
function handleDragStart(event) {
  const taskCard = event.target.closest('.task-card');
  if (!taskCard) return;

  // Add visual feedback
  taskCard.classList.add('dragging');

  // Store the task ID in the drag data
  const taskId = taskCard.dataset.taskId;
  event.dataTransfer.setData('text/plain', taskId);

  // Set drag effect
  event.dataTransfer.effectAllowed = 'move';
}

/**
 * Handles the end of a drag operation
 * @param {DragEvent} event - The drag event
 */
function handleDragEnd(event) {
  const taskCard = event.target.closest('.task-card');
  if (!taskCard) return;

  // Remove visual feedback
  taskCard.classList.remove('dragging');

  // Clean up drag over styles
  document.querySelectorAll('.task-list.drag-over').forEach(list => {
    list.classList.remove('drag-over');
  });
}

/**
 * Handles drag over event for drop zones
 * @param {DragEvent} event - The drag event
 */
function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  const listElement = event.currentTarget;
  if (!listElement.classList.contains('drag-over')) {
    listElement.classList.add('drag-over');
  }
}

/**
 * Handles drag leave event for drop zones
 * @param {DragEvent} event - The drag event
 */
function handleDragLeave(event) {
  const listElement = event.currentTarget;
  const relatedTarget = event.relatedTarget;

  // Only remove drag-over if we're actually leaving the drop zone
  if (!listElement.contains(relatedTarget)) {
    listElement.classList.remove('drag-over');
  }
}

/**
 * Handles drop event for task cards
 * @param {DragEvent} event - The drop event
 */
function handleDrop(event) {
  event.preventDefault();

  const listElement = event.currentTarget;
  listElement.classList.remove('drag-over');

  const taskId = event.dataTransfer.getData('text/plain');
  if (!taskId) return;

  // Get the target column status
  const targetColumn = listElement.closest('.column');
  const targetStatus = targetColumn.dataset.status;

  // Get the source column status
  const draggedElement = document.querySelector(`[data-task-id="${taskId}"]`);
  const sourceColumn = draggedElement.closest('.column');
  const sourceStatus = sourceColumn.dataset.status;

  // Don't do anything if dropped in the same column
  if (sourceStatus === targetStatus) {
    return;
  }

  // Update task status in storage
  const updatedTasks = updateTaskStatus(taskId, targetStatus);

  // Move the task element to the new column
  listElement.appendChild(draggedElement);

  // Trigger callback if provided
  if (typeof onTaskMoved === 'function') {
    onTaskMoved(taskId, sourceStatus, targetStatus, updatedTasks);
  }
}

/**
 * Makes a task card draggable
 * @param {HTMLElement} taskCard - The task card element
 */
export function makeDraggable(taskCard) {
  taskCard.draggable = true;
  taskCard.setAttribute('draggable', 'true');
}

/**
 * Updates drag and drop setup after DOM changes
 * Call this when new task cards are added to the DOM
 */
export function refreshDragAndDrop() {
  // Find all task cards and make them draggable
  const taskCards = document.querySelectorAll('.task-card');
  taskCards.forEach(card => {
    if (!card.hasAttribute('draggable')) {
      makeDraggable(card);
    }
  });
}

/**
 * Disables drag and drop functionality
 */
export function disableDragAndDrop() {
  const taskCards = document.querySelectorAll('.task-card');
  taskCards.forEach(card => {
    card.draggable = false;
    card.removeAttribute('draggable');
  });

  const taskLists = document.querySelectorAll('.task-list');
  taskLists.forEach(list => {
    list.removeEventListener('dragover', handleDragOver);
    list.removeEventListener('dragleave', handleDragLeave);
    list.removeEventListener('drop', handleDrop);
  });
}

/**
 * Re-enables drag and drop functionality
 */
export function enableDragAndDrop() {
  const taskLists = document.querySelectorAll('.task-list');
  taskLists.forEach(list => setupDropZone(list));

  refreshDragAndDrop();
}
