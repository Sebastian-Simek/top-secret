const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/middleware/UserService');

const userTest = {
  firstName: 'tester1',
  lastName: 'tester1 name',
  email: 'noodle2@noodle.com',
  password: '12345', 
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? userTest.password;

//   const agent = request.agent(app);

//   const user = await UserService.create({ ...userTest, ...userProps });


// };


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
  it('#GET /api/v1/secrets should return a 401 when signed out and listing all users', async () => {
    const res = await request(app).get('/api/v1/secrets');

    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401
    });
  });




  it('#DELETE /api/v1/users/sessions deletes a users session', async () => {
    const res = await request(app).delete('/api/v1/users/sessions');
    expect(res.status).toBe(200);
    const newRes = await request(app).get('/api/v1/users/sessions');
    expect(newRes.status).toBe(404);
  });
});
