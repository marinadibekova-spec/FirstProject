import { useEffect, useState } from 'react'

export default function TodoForm({ initialData = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '')
  const [priority, setPriority] = useState(initialData?.priority || 'medium')

  useEffect(() => {
    setTitle(initialData?.title || '')
    setDescription(initialData?.description || '')
    setDueDate(initialData?.dueDate ? initialData.dueDate.slice(0, 10) : '')
    setPriority(initialData?.priority || 'medium')
  }, [initialData])

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return alert('Title is required')
    onSubmit({ title: title.trim(), description, dueDate: dueDate || null, priority })
  }

  return (
    <form className="todo-form" onSubmit={submit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Due date
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </label>
      <label>
        Priority
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={() => { setTitle(''); setDescription(''); setDueDate(''); setPriority('medium'); if (onCancel) onCancel() }}>Cancel</button>
      </div>
    </form>
  )
}
