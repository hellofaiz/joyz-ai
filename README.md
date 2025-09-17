# Dynamic Kanban Board

A modern, interactive Kanban board built with vanilla JavaScript, featuring drag-and-drop functionality and local storage persistence.

## Features

### ✅ Task Management
- **Create Tasks**: Simple form with title and description fields
- **Add Button**: Instantly adds tasks to the "To Do" column
- **Delete Tasks**: Remove tasks with confirmation dialog

### ✅ Three-Column Layout
- **To Do**: New tasks start here
- **In Progress**: Tasks being worked on
- **Done**: Completed tasks

### ✅ Drag & Drop
- **Visual Feedback**: Cards show dragging state with rotation effect
- **Drop Zones**: Highlighted areas show valid drop targets
- **Smooth Transitions**: CSS transitions for better user experience
- **Cross-Column Movement**: Move tasks between any columns

### ✅ Persistence
- **Local Storage**: Tasks persist between browser sessions
- **Automatic Saving**: Changes are saved immediately
- **Data Recovery**: Tasks are restored on page reload

### ✅ User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Input validation with user feedback
- **Success/Error Messages**: Toast notifications for user actions
- **Hover Effects**: Interactive elements with smooth transitions

## Technical Architecture

### Modular Design
The application follows a modular architecture with separated concerns:

- **`utils.js`**: Utility functions for DOM manipulation, validation, and notifications
- **`storage.js`**: Local storage operations and data persistence
- **`dragDrop.js`**: Drag and drop functionality and event handling
- **`kanban.js`**: Main application logic and task management
- **`main.js`**: Application initialization and entry point

### Key Components

#### Utility Functions (`utils.js`)
- `createElement()`: DOM element creation helper
- `getElementById()`: Safe element retrieval with error handling
- `addEventListener()`: Enhanced event listener with delegation support
- `generateId()`: Unique ID generation for tasks
- `validateInput()`: Input validation utilities
- `showMessage()`: User notification system

#### Storage Layer (`storage.js`)
- `loadTasks()`: Load tasks from localStorage
- `saveTasks()`: Persist tasks to localStorage
- `addTask()`: Add new tasks to specific columns
- `updateTaskStatus()`: Move tasks between columns
- `deleteTask()`: Remove tasks from storage

#### Drag & Drop (`dragDrop.js`)
- `initDragAndDrop()`: Initialize drag and drop functionality
- `setupDropZone()`: Configure drop zones for columns
- `handleDragStart/End/Over/Leave/Drop()`: Drag event handlers
- `makeDraggable()`: Make elements draggable
- `refreshDragAndDrop()`: Update drag functionality after DOM changes

#### Kanban Board (`kanban.js`)
- `KanbanBoard` class: Main application controller
- Task creation, rendering, and management
- Event handling for user interactions
- Integration with storage and drag-drop modules

## Browser Support

- Modern browsers with ES6+ support
- HTML5 Drag and Drop API
- Local Storage API
- CSS Grid and Flexbox

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to `http://localhost:5173`

## Usage

### Adding Tasks
1. Enter a task title (required)
2. Add an optional description
3. Click "Add Task" or press Enter

### Moving Tasks
1. Click and hold a task card
2. Drag to the desired column
3. Release to drop the task

### Deleting Tasks
1. Hover over a task card
2. Click the × button in the top-right corner
3. Confirm deletion in the dialog

## Data Structure

Tasks are stored as objects with the following structure:

```javascript
{
  id: "unique-id",
  title: "Task Title",
  description: "Task Description",
  status: "todo", // "todo" | "in-progress" | "done"
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Styling

The application uses modern CSS with:
- CSS Grid for layout
- Flexbox for component alignment
- CSS transitions for smooth animations
- Responsive design with media queries
- Clean, modern color scheme

## Development

### Project Structure
```
src/
├── main.js          # Application entry point
├── kanban.js        # Main Kanban logic
├── dragDrop.js      # Drag and drop functionality
├── storage.js       # Local storage operations
├── utils.js         # Utility functions
├── index.css        # Application styles
└── assets/          # Static assets
```

### Code Quality
- Modular architecture with separation of concerns
- Comprehensive error handling
- Input validation and sanitization
- Consistent code style and documentation
- ES6+ features and modern JavaScript practices

## License

This project is open source and available under the MIT License.