const request = require('supertest');
const state = {
  books: [],
  nextId: 1,
};

jest.mock('./db', () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  run: jest.fn(async (sql, params = []) => {
    if (sql.startsWith('INSERT INTO books')) {
      const name = params[0];
      const id = state.nextId++;
      state.books.push({ id, name });
      return { id, changes: 1 };
    }

    if (sql.startsWith('DELETE FROM books')) {
      const targetId = Number(params[0]);
      const index = state.books.findIndex((book) => book.id === targetId);

      if (index === -1) {
        return { id: 0, changes: 0 };
      }

      state.books.splice(index, 1);
      return { id: 0, changes: 1 };
    }

    if (sql.startsWith('UPDATE books SET name')) {
      const [newName, rawId] = params;
      const targetId = Number(rawId);
      const book = state.books.find((item) => item.id === targetId);

      if (!book) {
        return { id: 0, changes: 0 };
      }

      book.name = newName;
      return { id: 0, changes: 1 };
    }

    throw new Error(`Unhandled query: ${sql}`);
  }),
}));

const app = require('./app');
const { close } = require('./db');

beforeEach(() => {
  state.books = [];
  state.nextId = 1;
});

afterAll(async () => {
  await close();
});

describe('Book CRUD API', () => {
  test('creates a book using /create/:name', async () => {
    const response = await request(app).post('/create/The%20Hobbit');

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('The Hobbit');
    expect(response.body.id).toBeGreaterThan(0);
  });

  test('updates a book using /update/:id?newName=', async () => {
    const created = await request(app).post('/create/Old%20Name');

    const response = await request(app).put(
      `/update/${created.body.id}?newName=New%20Name`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      id: created.body.id,
      name: 'New Name',
    });
  });

  test('deletes a book using /delete/:id', async () => {
    const created = await request(app).post('/create/Delete%20Me');

    const response = await request(app).delete(`/delete/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});
