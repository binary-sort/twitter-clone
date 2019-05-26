require('./init');

const Token = require('./../models/token');
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

let auth_token = '';
let userId;

describe('Tweets', () => {
  before((done) => {
    Token.query().select('token').joinRelation('user').where('user.username', 'testuser').first().then(result => {
      auth_token = 'Bearer ' + result.token;
      User.query().insert({
        username: 'testuser2',
        password: '1234'
      }).returning('*').then(inserted_result => {
        userId = inserted_result.id;
        console.log('*************\n', userId, '\n', auth_token);
        done();
      })
    })
  });
  describe('/POST follow/:userId', () => {
    it('should return user not found error', (done) => {
      chai.request(server)
        .post('/follow' + '/asdf')
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('User not found!');
          done();
        });
    });
    it('should follow testuser2', (done) => {
      chai.request(server)
        .post('/follow/' + userId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Started following user!');
          done();
        });
    });
    it('should throw already following error', (done) => {
      chai.request(server)
        .post('/follow/' + userId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.data.should.have.property('message').eql('Already following this user!');
          done();
        });
    });
  });
  describe('/POST unfollow/:userId', () => {
    it('should return user not found error', (done) => {
      chai.request(server)
        .delete('/unfollow' + '/asdf')
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('User not found!');
          done();
        });
    });
    it('should unfollow testuser2', (done) => {
      chai.request(server)
        .delete('/unfollow/' + userId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it('should throw already unfollowing error', (done) => {
      chai.request(server)
        .delete('/unfollow/' + userId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.data.should.have.property('message').eql('Already not following this user!');
          done();
        });
    });
  });
});
