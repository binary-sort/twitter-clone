require('./init');

const Token = require('./../models/token');

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
let tweetId;
const tweet = 'This is a test tweet!';

describe('Tweets', () => {
  before((done) => {
    Token.query().select('token').joinRelation('user').where('user.username', 'testuser').first().then(result => {
      auth_token = 'Bearer ' + result.token;
      done();
    })
  });
  describe('Unauthorized Check', () => {
    it('should throw unauthorized respone!', (done) => {
      chai.request(server)
        .get('/timeline')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        })
    })
  })
  describe('Tweets', () => {
    it('GET /timeline: should get all the tweets for timeline!', (done) => {
      chai.request(server)
        .get('/timeline')
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(0);
          done();
        })
    });
    it('POST /tweet: should create a tweet!', (done) => {
      chai.request(server)
        .post('/tweet')
        .send({
          tweet
        })
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('tweet').eql(tweet);
          tweetId = res.body.data.id;
          done();
        })
    });
    it('GET /tweet/:tweetId: should get the tweet!', (done) => {
      chai.request(server)
        .get('/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.have.property('id').eql(tweetId);
          res.body.data.should.have.property('tweet').eql(tweet);
          done();
        })
    });
    it('GET /tweet/:tweetId: should delete the tweet!', (done) => {
      chai.request(server)
        .delete('/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });
  })
})
