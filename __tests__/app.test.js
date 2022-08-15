const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/middleware/UserService');

const userTest = {
  firstName: 'tester1',
  lastName: 'tester1 name',
  email: 'noodle2@noodle.com',
  password: '12345', 
};

const registerAndLogin = async (userProps = {}) => {
  // const password = userProps.password ?? userTest.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...userTest, ...userProps });

  // const { email } = user;
  // await  agent.post('/api/v1/users/sessions').send({ email, password });

  return [agent, user];

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
      message: 'Signed in successfully',
      user: { id: expect.any(String),
        firstName, 
        lastName,
        email }
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
  it('#POST /api/v1/secrets should post a new row', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/secrets').send({
      title: 'I am testing again',
      description: 'woohoo testing!'
    });
    console.log('res.body', res.body);
    expect(res.status).toBe(200);

  });
  
  
  it('#GET /api/v1/secrets should return a 401 when signed out and listing all secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');

    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401
    });
  });
  it('#GET /api/v1/secrets should return a list of secrets', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');

    expect(res.status).toBe(200);
  });
  
  it('#DELETE /api/v1/users/sessions deletes a users session', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.status).toBe(200); 

    expect(res.body).toEqual({ success: true, message: 'Signed out successfully' });
    const newRes = await agent.get('/api/v1/users/sessions');
    expect(newRes.status).toBe(404);
  });
});

