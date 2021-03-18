const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
require('dotenv').config();
const { User, newUser } = require('../model/__mocks__/data');
const app = require('../app');

const SECRET_WORD = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_WORD);
User.token = token;

jest.mock('../model/users.js');

describe('Testing the route api/users', () => {
  it('should return 201 status for registration', async done => {
    const res = await request(app)
      .post('/api/users/auth/register')
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 409 status for registration - email already used', async done => {
    const res = await request(app)
      .post('/api/users/auth/register')
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(409);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 200 status for login', async done => {
    const res = await request(app)
      .post('/api/users/auth/login')
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 401 status for login wrong data', async done => {
    const res = await request(app)
      .post('/api/users/auth/login')
      .send({ email: 'fake@test.com', password: 'bB121432' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 400 status for login validation error ', async done => {
    const res = await request(app)
      .post('/api/users/auth/login')
      .send({ email: '', password: '' })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 200 status for upload avatar', async done => {
    const buffer = await fs.readFile('./test/default-avatar.png');
    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', buffer, 'default-avatar.png');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 401 status for upload unauthorized error', async done => {
    const buffer = await fs.readFile('./test/default-avatar.png');
    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${567}`)
      .attach('avatar', buffer, 'default-avatar.png');
    expect(res.status).toEqual(401);
    done();
  });

  it('should return 200 status for current user', async done => {
    const res = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 401 status for current user unauthorized error ', async done => {
    const res = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${567}`);

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 200 status for update subscription', async done => {
    const res = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ subscription: 'free' });

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 400 status for update subscription validation error ', async done => {
    const res = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ subscription: 'super' });

    expect(res.status).toEqual(400);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 401 status for update subscription unauthorized error ', async done => {
    const res = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${567}`)
      .send({ subscription: 'free' });

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 204 status for logout', async done => {
    const res = await request(app)
      .post('/api/users/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(204);
    expect(res.body).toBeDefined();
    done();
  });

  it('Logout unauthorized error should return 401 status', async done => {
    const res = await request(app)
      .post('/api/users/auth/logout')
      .set('Authorization', `Bearer ${567}`);

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    done();
  });
});
