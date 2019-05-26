require('./init');

const User = require('./../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
const should = chai.should();

chai.use(chaiHttp);

const user = {
  username: 'testuser',
  password: '1234'
};

describe('Users', () => {
  before((done) => {
    User.query().where('username', 'testuser').orWhere('username', 'testuser2').delete().then(result => {
      done();
    })
  });
  describe('/POST login user', () => {
    it('it should throw no user found error', (done) => {
      chai.request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('data');
          res.body.data.should.have.property('message').eql('User with this username doesn\'t exist');
          done();
        })
    })
  });
  describe('/POST user', () => {
    it('it should create a user', (done) => {
      chai.request(server)
        .post('/user')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('username').eql('testuser');
          res.header.should.have.property('authorization');
          done();
        })
    });
    it('it should throw user already exists error', (done) => {
      chai.request(server)
        .post('/user')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('data');
          res.body.data.should.have.property('message').eql('Account already exists with this username!')
          done();
        })
    });
  });
  describe('/POST login user', () => {
    it('it should throw incorrect password error', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          ...user,
          password: '12345'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('data');
          res.body.data.should.have.property('message').eql('Incorrect Password!')
          done();
        })
    });
    it('it should log in user', (done) => {
      chai.request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.header.should.have.property('authorization');
          res.body.should.have.property('data');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('username').eql('testuser');
          done();
        })
    })
  });
});
