const db = require('../../../lib/db')

module.exports = async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const todo = await db.getTodoById(id)
    if (!todo) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(todo)
  }

  if (req.method === 'PUT') {
    try {
      const updated = await db.updateTodo(id, req.body)
      return res.status(200).json(updated)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'DB error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const ok = await db.deleteTodo(id)
      if (!ok) return res.status(404).json({ error: 'Not found' })
      return res.status(204).end()
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'DB error' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end('Method Not Allowed')
}
