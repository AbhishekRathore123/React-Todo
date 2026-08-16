import * as React from "react";
import "./App.css";

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

function App() {
  const [currentValue, setCurrentValue] = React.useState("");
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  function handleAddTodo() {
    if (currentValue.trim() === "") return;

    const newTodo: Todo = {
      id: `${Date.now()}`,
      title: currentValue,
      isCompleted: false,
    };
    setTodos([...todos, newTodo]);
    setCurrentValue("");
  }

  function handleToggleTodo(id: string) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  function handleRemoveTodo(id: string) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function handleStartEdit(id: string, currentTitle: string) {
    setEditingId(id);
    setEditValue(currentTitle);
  }

  function handleSaveEdit(id: string) {
    if (editValue.trim() === "") return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: editValue } : todo
      )
    );
    setEditingId(null);
    setEditValue("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  }

  function handleEditKeyPress(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
    if (e.key === "Enter") {
      handleSaveEdit(id);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  }

  const activeTodos = todos.filter((todo) => !todo.isCompleted).length;

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>✓ My Todo List</h1>
        <p className="todo-count">
          {activeTodos} of {todos.length} todos remaining
        </p>
      </div>

      <div className="input-section">
        <input
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyPress={handleKeyPress}
          value={currentValue}
          type="text"
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="add-button">
          Add
        </button>
      </div>

      <div className="todos-section">
        {todos.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one to get started!</p>
        ) : (
          <ul className="todos-list">
            {todos.map((todo) => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.isCompleted ? "completed" : ""}`}
                onClick={() => !editingId && handleToggleTodo(todo.id)}
                style={{ cursor: editingId ? 'default' : 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleToggleTodo(todo.id)}
                  className="todo-checkbox"
                  onClick={(e) => e.stopPropagation()}
                />
                {editingId === todo.id ? (
                  <div className="edit-container" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                      onBlur={() => handleSaveEdit(todo.id)}
                      className="edit-input"
                      autoFocus
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit(todo.id);
                      }}
                      className="save-button"
                    >
                      ✓
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      className="cancel-button"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="todo-title">{todo.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(todo.id, todo.title);
                      }}
                      className="edit-button"
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTodo(todo.id);
                      }}
                      className="delete-button"
                    >
                      ✕
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
