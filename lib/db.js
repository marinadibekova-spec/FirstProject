const path = require('path')
const fs = require('fs')

// Use sql.js (SQLite compiled to WASM) for a native-free SQLite engine.
// This loads the wasm module on first use and persists the DB file to data/db.sqlite.

let initPromise = null

function locateWasm() {
  // Resolve wasm relative to the project root so it works when Next.js builds server files
  return path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')
}

async function getInstance() {
  if (!initPromise) {
    initPromise = (async () => {
      const initSqlJs = require('sql.js')
      // Load the wasm binary directly from node_modules to avoid path issues
      const wasmPath = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')
      const wasmBinary = fs.readFileSync(wasmPath)
      const SQL = await initSqlJs({ wasmBinary })

      const dbDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
      const dbPath = path.join(dbDir, 'db.sqlite')

      let db
      if (fs.existsSync(dbPath)) {
        const buf = fs.readFileSync(dbPath)
        db = new SQL.Database(new Uint8Array(buf))
      } else {
        db = new SQL.Database()
        db.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            dueDate TEXT,
            priority TEXT,
            completed INTEGER DEFAULT 0,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          );
        `)
        fs.writeFileSync(dbPath, Buffer.from(db.export()))
      }

      return { SQL, db, dbPath }
    })()
  }
  return initPromise
}

function rowsFromResult(result) {
  if (!result || result.length === 0) return []
  const { columns, values } = result[0]
  return values.map((row) => {
    const obj = {}
    columns.forEach((c, i) => { obj[c] = row[i] })
    if ('completed' in obj) obj.completed = Boolean(obj.completed)
    return obj
  })
}

async function getAllTodos() {
  const { db } = await getInstance()
  const res = db.exec('SELECT * FROM todos ORDER BY createdAt DESC')
  return rowsFromResult(res)
}

async function getTodoById(id) {
  const { db } = await getInstance()
  const res = db.exec('SELECT * FROM todos WHERE id = ' + Number(id))
  const rows = rowsFromResult(res)
  return rows[0] || null
}

async function createTodo({ title, description, dueDate, priority }) {
  const { db, dbPath } = await getInstance()
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt
  const stmt = db.prepare('INSERT INTO todos (title, description, dueDate, priority, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
  stmt.run([title, description || null, dueDate || null, priority || 'medium', 0, createdAt, updatedAt])
  stmt.free()
  const idRes = db.exec('SELECT last_insert_rowid() as id')
  const id = idRes[0].values[0][0]
  fs.writeFileSync(dbPath, Buffer.from(db.export()))
  return getTodoById(id)
}

async function updateTodo(id, data) {
  const { db, dbPath } = await getInstance()
  const fields = []
  const values = []
  if ('title' in data) { fields.push('title = ?'); values.push(data.title) }
  if ('description' in data) { fields.push('description = ?'); values.push(data.description) }
  if ('dueDate' in data) { fields.push('dueDate = ?'); values.push(data.dueDate) }
  if ('priority' in data) { fields.push('priority = ?'); values.push(data.priority) }
  if ('completed' in data) { fields.push('completed = ?'); values.push(data.completed ? 1 : 0) }
  if (fields.length === 0) return getTodoById(id)
  values.push(new Date().toISOString())
  values.push(Number(id))
  const sql = `UPDATE todos SET ${fields.join(', ')}, updatedAt = ? WHERE id = ?`
  const stmt = db.prepare(sql)
  stmt.run(values)
  stmt.free()
  fs.writeFileSync(dbPath, Buffer.from(db.export()))
  return getTodoById(id)
}

async function deleteTodo(id) {
  const { db, dbPath } = await getInstance()
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?')
  const info = stmt.run([Number(id)])
  stmt.free()
  fs.writeFileSync(dbPath, Buffer.from(db.export()))
  // sql.js doesn't return changes directly; run a select to check
  return true
}

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo }
