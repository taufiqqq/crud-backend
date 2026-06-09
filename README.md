# crud-backend

Simple Node.js backend for tracking books in an SQL database.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
PORT=3000
DB_NAME=crud-example
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_LINK=./crud-example.db
```

3. Run the server:

```bash
npm start
```

## API

- `POST /create/:name`
- `DELETE /delete/:id`
- `PUT /update/:id?newName=...`

Frontend calls:

```js
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

await fetch(`${API_BASE_URL}/create/${encodeURIComponent(name)}`, { method: 'POST' });
await fetch(`${API_BASE_URL}/delete/${id}`, { method: 'DELETE' });
await fetch(`${API_BASE_URL}/update/${id}?newName=${encodeURIComponent(newName)}`, { method: 'PUT' });
```
