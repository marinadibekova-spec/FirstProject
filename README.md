# Minimal Todo (Next.js + SQLite)

This workspace now contains a small Next.js app scaffold for a local, minimal todo application backed by SQLite.

Local development

1. Install dependencies

```bash
npm install
```

2. Initialize the SQLite database

```bash
npm run init-db
```

3. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Files added

- `pages/` — Next.js pages and API routes
- `components/` — UI components (`TodoForm`, `TodoList`)
- `lib/db.js` — SQLite helpers (uses `better-sqlite3`)
- `scripts/init-db.js` — creates `data/db.sqlite` and seeds a sample todo
- `styles/globals.css` — minimal styling

Notes

- This project is intended to run locally only. There is no authentication.
- If the native SQLite package fails to install on your machine, I can switch to a WASM-based `sql.js` alternative.