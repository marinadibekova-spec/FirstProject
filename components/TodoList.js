export default function TodoList({ todos = [], onEdit, onDelete, onToggleComplete }) {
  if (!todos || todos.length === 0) return <p>No todos yet.</p>

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <div className="left">
            <input
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => onToggleComplete(todo.id, !todo.completed)}
            />
            <div className="meta">
              <strong>{todo.title}</strong>
              {todo.description ? <div className="desc">{todo.description}</div> : null}
              <div className="small">
                {todo.dueDate ? `Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}
                {todo.priority ? ` • Priority: ${todo.priority}` : ''}
              </div>
            </div>
          </div>
          <div className="actions">
            <button onClick={() => onEdit(todo)}>Edit</button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
