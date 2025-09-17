/**
 * Utility functions for DOM manipulation and common operations
 */

/**
 * Creates an HTML element with specified attributes and content
 * @param {string} tagName - The HTML tag name
 * @param {Object} attributes - Object containing attribute key-value pairs
 * @param {string|Node} content - Text content or child element
 * @returns {HTMLElement} The created element
 */
export function createElement(tagName, attributes = {}, content = '') {
  const element = document.createElement(tagName);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  // Add content
  if (typeof content === 'string' && !attributes.textContent && !attributes.innerHTML) {
    element.textContent = content;
  } else if (content instanceof Node) {
    element.appendChild(content);
  }

  return element;
}

/**
 * Gets an element by ID with optional error handling
 * @param {string} id - Element ID
 * @param {boolean} required - Whether to throw error if element not found
 * @returns {HTMLElement|null} The element or null if not required
 */
export function getElementById(id, required = true) {
  const element = document.getElementById(id);
  if (required && !element) {
    throw new Error(`Element with ID "${id}" not found`);
  }
  return element;
}

/**
 * Adds event listener to an element with optional selector delegation
 * @param {HTMLElement} element - The element to attach listener to
 * @param {string} eventType - The event type (e.g., 'click')
 * @param {Function} handler - The event handler function
 * @param {string} selector - Optional CSS selector for event delegation
 */
export function addEventListener(element, eventType, handler, selector = null) {
  if (selector) {
    element.addEventListener(eventType, (event) => {
      if (event.target.matches(selector) || event.target.closest(selector)) {
        handler(event);
      }
    });
  } else {
    element.addEventListener(eventType, handler);
  }
}

/**
 * Generates a unique ID for tasks
 * @returns {string} Unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validates input values
 * @param {string} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the value is valid
 */
export function validateInput(value, options = {}) {
  const { required = false, minLength = 0, maxLength = Infinity } = options;

  if (required && (!value || value.trim() === '')) {
    return false;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
}

/**
 * Shows a temporary message to the user
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'info')
 * @param {number} duration - Duration in milliseconds
 */
export function showMessage(message, type = 'info', duration = 3000) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.message-notification');
  existingMessages.forEach(msg => msg.remove());

  // Create message element
  const messageEl = createElement('div', {
    className: `message-notification ${type}`,
    textContent: message
  });

  // Add styles for message
  Object.assign(messageEl.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: '1000',
    opacity: '0',
    transform: 'translateY(-20px)',
    transition: 'all 0.3s ease'
  });

  // Set background color based on type
  const colors = {
    success: '#27ae60',
    error: '#e74c3c',
    info: '#3498db'
  };
  messageEl.style.backgroundColor = colors[type] || colors.info;

  // Add to DOM
  document.body.appendChild(messageEl);

  // Animate in
  setTimeout(() => {
    messageEl.style.opacity = '1';
    messageEl.style.transform = 'translateY(0)';
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 300);
  }, duration);
}
