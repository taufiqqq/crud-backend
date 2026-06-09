# crud-backend new

Simple Node.js backend for tracking books in a MySQL database.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
PORT=3000
DB_NAME=crud-example
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
# Optional: DB_LINK can be a full MySQL connection URL.
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


Convert a CA certificate to Base64 on Windows (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\ca-certificate.crt")) |
  Out-File -Encoding ascii C:\path\to\ca-base64.txt

or for Mac

base64 -i /path/to/ca-certificate.crt -o /path/to/ca-base64.txt
