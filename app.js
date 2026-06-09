const express = require('express');
const { initializeDatabase, run, db } = require('./db');

const app = express();

initializeDatabase();

app.post('/create/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      res.status(400).json({ error: 'name is required' });
      return;
    }

    const result = await run('INSERT INTO books (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.id, name });
  } catch (error) {
    res.status(500).json({ error: 'failed to create book' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await run('DELETE FROM books WHERE id = ?', [id]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'book not found' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'failed to delete book' });
  }
});

app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.query;

    if (!newName) {
      res.status(400).json({ error: 'newName is required' });
      return;
    }

    const result = await run('UPDATE books SET name = ? WHERE id = ?', [newName, id]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'book not found' });
      return;
    }

    res.status(200).json({ success: true, id: Number(id), name: newName });
  } catch (error) {
    res.status(500).json({ error: 'failed to update book' });
  }
});

app.get('/books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM books');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch books' });
  }
});

module.exports = app;
