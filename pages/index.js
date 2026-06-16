import { useEffect, useState } from 'react'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  async function fetchTodos() {
    setLoading(true)
    try {
      const res = await fetch('/api/todos')
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  async function handleCreate(payload) {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    fetchTodos()
  }

  async function handleUpdate(id, payload) {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    setEditing(null)
    fetchTodos()
  }

  async function handleDelete(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  return (
    <div className="page">
      <header className="app-header">
        <div className="container">
          <h1>Tasks</h1>
          <p className="tagline">Stay focused, stay productive</p>
        </div>
      </header>
      <main className="container">
        <section className="panel">
          <h2>Create / Edit</h2>
          <TodoForm
            key={editing ? editing.id : 'new'}
            initialData={editing}
            onSubmit={editing ? (data) => handleUpdate(editing.id, data) : handleCreate}
            onCancel={() => setEditing(null)}
          />
        </section>

        <section className="panel">
          <h2>Todo List</h2>
          {loading ? <p>Loading…</p> : (
            <TodoList
              todos={todos}
              onEdit={(t) => setEditing(t)}
              onDelete={(id) => handleDelete(id)}
              onToggleComplete={(id, completed) => handleUpdate(id, { completed: completed ? 1 : 0 })}
            />
          )}
        </section>
      </main>
    </div>
  )
}
