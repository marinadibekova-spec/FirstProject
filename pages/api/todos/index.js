const db = require('../../../lib/db')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const todos = await db.getAllTodos()
      return res.status(200).json(todos)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'DB error' })
    }
  }

  if (req.method === 'POST') {
    const { title, description, dueDate, priority } = req.body
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' })
    try {
      const todo = await db.createTodo({ title: title.trim(), description, dueDate, priority })
      return res.status(201).json(todo)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'DB error' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end('Method Not Allowed')
}
