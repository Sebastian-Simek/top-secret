const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const userTest = {
  firstName: 'tester1',
  lastName: 'tester1 name',
  email: 'noodle2@noodle.com',
  password: '12345', 
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('#POST /api/vi/users creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(userTest);
    const { firstName, lastName, email } = userTest;
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      firstName, 
      lastName,
      email
    });
  });
  it('#POST /api/v1/users/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(userTest);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'noodle2@noodle.com', password: '12345' });
    expect(res.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
