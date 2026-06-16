const db = require('../lib/db')

;(async () => {
  try {
    // Ensure DB is created and table exists by calling a helper
    const todos = await db.getAllTodos()
    if (!todos || todos.length === 0) {
      await db.createTodo({ title: 'Welcome', description: 'This is your first todo — edit or delete it.', dueDate: null, priority: 'medium' })
      console.log('Inserted sample todo')
    }
    console.log('Initialized database (sql.js)')
  } catch (err) {
    console.error('DB init error', err)
    process.exit(1)
  }
})()
