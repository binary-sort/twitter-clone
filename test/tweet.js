require('./init');

const Token = require('./../models/token');
const User = require('./../models/user');
const Tweet = require('./../models/tweet');

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
let likeTweetId;
const tweet = 'This is a test tweet!';

describe('Tweets', () => {
  before((done) => {
    Token.query().select('token').joinRelation('user').where('user.username', 'testuser').first().then(result => {
      auth_token = 'Bearer ' + result.token;
      User.query().where('username', 'testuser2').first().then(user => {
        Tweet.query().insert({
          tweet: 'Test Tweet',
          user_id: user.id
        }).then(tweet => {
          likeTweetId = tweet.id;
          done();
        })
      })
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
    it('DELETE /tweet/:tweetId: should delete the tweet!', (done) => {
      chai.request(server)
        .delete('/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });
  });
  describe('POST /like/tweet/:tweetId', () => {
    it('should throw tweet not found error', (done) => {
      chai.request(server)
        .post('/like/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        })
    });
    it('should like the tweet', (done) => {
      chai.request(server)
        .post('/like/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        })
    });
    it('should already liking the tweet error', (done) => {
      chai.request(server)
        .post('/like/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
    });
  });
  describe('DELETE /unlike/tweet/:tweetId', () => {
    it('should throw tweet not found error', (done) => {
      chai.request(server)
        .delete('/unlike/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        })
    });
    it('should unlike the tweet', (done) => {
      chai.request(server)
        .delete('/unlike/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });
    it('should already unliking the tweet error', (done) => {
      chai.request(server)
        .delete('/unlike/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
    });
  });
  describe('POST /retweet/tweet/:tweetId', () => {
    it('should throw tweet not found error', (done) => {
      chai.request(server)
        .post('/retweet/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        })
    });
    it('should retweet the tweet', (done) => {
      chai.request(server)
        .post('/retweet/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        })
    });
    it('should already liking the tweet error', (done) => {
      chai.request(server)
        .post('/retweet/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
    });
  });
  describe('DELETE /unretweet/tweet/:tweetId', () => {
    it('should throw tweet not found error', (done) => {
      chai.request(server)
        .delete('/unretweet/tweet/' + tweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        })
    });
    it('should unretweet the tweet', (done) => {
      chai.request(server)
        .delete('/unretweet/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });
    it('should already unretweeted the tweet error', (done) => {
      chai.request(server)
        .delete('/unretweet/tweet/' + likeTweetId)
        .set('authorization', auth_token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
    });
  });
})
