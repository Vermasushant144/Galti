const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');  // Your backend server file (app.js or index.js)
const should = chai.should();

chai.use(chaiHttp);

describe('User Authentication', () => {
  it('should register a new user', (done) => {
    chai.request(server)
      .post('/api/auth/register')
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        done();
      });
  });

  it('should login a user', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({
        email: "testuser@example.com",
        password: "password123"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        done();
      });
  });
});
