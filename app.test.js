process.env.DB_LINK = ':memory:';

const request = require('supertest');
const app = require('./app');
const { close } = require('./db');

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
