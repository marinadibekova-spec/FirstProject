## Plan: Minimal Next.js + SQLite Todo App

TL;DR: Scaffold a small local Next.js (JavaScript, Pages router) app using direct SQLite for storage. Implement REST API routes for CRUD and a simple client UI to create, edit, and delete todos. Keep the UI minimal and dependency-light so you can iterate quickly.

**Steps**
1. Scaffold project
   - Run `npx create-next-app@latest` and choose **JavaScript** and **Pages Router** (name: `my-todo`).
2. Install dependencies
   - From project root: `npm install better-sqlite3` (or `sqlite3` if you prefer).
3. Initialize database
   - Create `scripts/init-db.js` that ensures `data/db.sqlite` exists and creates a `todos` table with columns: `id` (PK), `title` (text, required), `description` (text), `dueDate` (text / ISO), `priority` (text: low|medium|high), `completed` (integer 0/1), `createdAt`, `updatedAt`.
   - Add an npm script: `"init-db": "node scripts/init-db.js"`.
4. Database helper
   - Add `lib/db.js` exporting CRUD helpers: `getAllTodos()`, `getTodoById(id)`, `createTodo(data)`, `updateTodo(id, data)`, `deleteTodo(id)`.
   - Use `better-sqlite3` and a global singleton to avoid multiple connections during HMR in dev.
5. API routes (Pages router)
   - `pages/api/todos/index.js` — handles `GET` (list) and `POST` (create).
   - `pages/api/todos/[id].js` — handles `GET` (single), `PUT` (update), `DELETE` (remove).
   - Use JSON request bodies and return JSON responses with appropriate status codes.
6. Frontend
   - `pages/index.js` — main UI: lists todos, shows create form, supports editing and deleting.
   - `components/TodoForm.js` — controlled form used for create + edit.
   - `components/TodoList.js` — renders items with edit/delete controls.
   - Keep UI state simple: fetch on mount, refetch after mutations (or implement small client-side cache).
7. Styling
   - Use a minimal stylesheet `styles/globals.css` or CSS Modules. Avoid a CSS framework for the initial iteration.
8. Scripts & docs
   - Ensure `package.json` has `dev`, `build`, `start` scripts from Next.js and `init-db`.
   - Update `README.md` with local run steps.

**Relevant files**
- package.json — (created by create-next-app)
- scripts/init-db.js — DB init/seed script
- data/db.sqlite — generated DB file
- lib/db.js — SQLite connection + helper functions
- pages/api/todos/index.js — API (GET, POST)
- pages/api/todos/[id].js — API (GET, PUT, DELETE)
- pages/index.js — main UI page
- components/TodoForm.js — create/edit form
- components/TodoList.js — list + controls
- styles/globals.css — minimal styling
- README.md — run instructions

**Verification**
1. Install & init DB
   - `npm install`
   - `npm run init-db` → verify `data/db.sqlite` exists
2. Start dev server
   - `npm run dev` → open `http://localhost:3000`
3. API smoke tests (examples)
   - List: `curl -s http://localhost:3000/api/todos | jq` (or omit `| jq`)
   - Create: `curl -X POST -H "Content-Type: application/json" -d '{"title":"Test","description":"hello","dueDate":"2026-06-17","priority":"medium"}' http://localhost:3000/api/todos`
   - Update: `curl -X PUT -H "Content-Type: application/json" -d '{"title":"Updated","completed":1}' http://localhost:3000/api/todos/1`
   - Delete: `curl -X DELETE http://localhost:3000/api/todos/1`
4. UI tests: create, edit, and delete todos from the browser; ensure list updates.

**Decisions & assumptions**
- Language: JavaScript (your choice in the prompt).
- Router: Pages router with API routes for simplicity and clarity.
- DB: Direct SQLite access using `better-sqlite3` (lighter than adding an ORM). This keeps the stack minimal for local-only use.
- Todo fields: `title`, `description`, `dueDate`, `priority`, `completed`, timestamps.
- No authentication or remote hosting — local-only app.

**Further considerations**
1. If you want type-safety later, I can convert to TypeScript and/or add Prisma.
2. If you prefer a zero-native-dependency SQLite driver (no native build), I can switch to a WebAssembly-based approach (`sql.js`) instead.
3. Optional UX improvements later: optimistic updates, filtering/sorting, tags.
