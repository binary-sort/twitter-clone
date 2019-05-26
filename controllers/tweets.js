const Tweets = require('../models/tweet');
const Likes = require('./../models/likes');
const Retweet = require('./../models/retweet');

const CreateTweet = async (req, res) => {
    let parentId = req.params.tweetId;
    if (typeof parentId !== 'undefined') {
        if (!+parentId) {
            throw notFoundError('Tweet not Found!');
        }
        let tweet = await Tweets.query().findById(+parentId);
        if (!tweet) {
            throw notFoundError('Tweet not Found!');
        }
    }
    let payload = {
        user_id: req.user.id,
        tweet: req.body.tweet,
        parent_id: parentId || null
    };
    let insertedTweet = await Tweets.query()
        .insert(payload)
        .returning('*');
    return createdResponse(res, insertedTweet);
}

const DeleteTweet = async (req, res) => {
    let id = req.params.tweetId;
    let tweet = await Tweets.query().where('id', id).first();
    if (!tweet) {
        throw notFoundError('Tweet does not exist!');
    }
    await Tweets.query().deleteById(id);
    return noContentResponse(res);
}

const TimelineTweets = async (req, res) => {
    let tweets = await Tweets.query()
        .whereRaw('user_id in (select followed from user_following where follower = ?)', req.user.id)
        .orWhere('user_id', req.user.id)
        .where('parent_id', null)
        .orderBy('created_at', 'DESC');
    return okResponse(res, tweets);
}

const GetTweet = async (req, res) => {
    let tweetId = req.params.tweetId;
    if (!+tweetId) {
        throw notFoundError('Tweet not found!');
    }
    let tweet = await Tweets.query().findById(+tweetId).eager('[parent, children]');
    if (!tweet) {
        throw notFoundError('Tweet not Found!');
    }
    return okResponse(res, tweet);
}

const LikeTweet = async (req, res) => {
    let tweetId = req.params.tweetId;
    let userId = req.user.id;
    if (!+tweetId) {
        throw notFoundError('Tweet not found!');
    }
    let tweet = await Tweets.query().findById(+tweetId);
    if (!tweet) {
        throw notFoundError('Tweet not Found!');
    }
    let like = await Likes.query()
        .where('tweet_id', tweetId)
        .where('user_id', userId)
        .first();
    if (like) {
        throw badRequestError('Already liking this tweet!');
    }
    like = await Likes.query().insert({
        tweet_id: tweetId,
        user_id: userId
    })
    return createdResponse(res, like, 'Tweet liked!');
}

const UnlikeTweet = async (req, res) => {
    let tweetId = req.params.tweetId;
    let userId = req.user.id;
    if (!+tweetId) {
        throw notFoundError('Tweet not found!');
    }
    let tweet = await Tweets.query().findById(+tweetId);
    if (!tweet) {
        throw notFoundError('Tweet not Found!');
    }
    let like = await Likes.query()
        .where('tweet_id', tweetId)
        .where('user_id', userId)
        .first();
    if (!like) {
        throw badRequestError('Already not liking this tweet!');
    }
    await Likes.query()
        .where('tweet_id', tweetId)
        .where('user_id', userId)
        .delete();
    return noContentResponse(res, 'Tweet unliked!');
}

const RetweetTweet = async (req, res) => {
    let tweetId = req.params.tweetId;
    let userId = req.user.id;
    if (!+tweetId) {
        throw notFoundError('Tweet not found!');
    }
    let tweet = await Tweets.query().findById(+tweetId);
    if (!tweet) {
        throw notFoundError('Tweet not Found!');
    }
    let retweet = await Retweet.query()
        .where('tweet_id', tweetId)
        .where('user_id', userId)
        .first();
    if (retweet) {
        throw badRequestError('Already retweeted this tweet!');
    }
    retweet = await Retweet.query().insert({
        tweet_id: tweetId,
        user_id: userId
    })
    return createdResponse(res, retweet, 'Tweet retweeted!');
}

const UnRetweetTweet = async (req, res) => {
    let tweetId = req.params.tweetId;
    let userId = req.user.id;
    if (!+tweetId) {
        throw notFoundError('Tweet not found!');
    }
    let tweet = await Tweets.query().findById(+tweetId);
    if (!tweet) {
        throw notFoundError('Tweet not Found!');
    }
    let retweet = await Retweet.query()
        .where('tweet_id', tweetId)
        .where('user_id', userId)
        .first();
    if (!retweet) {
        throw badRequestError('Already not retweeted this tweet!');
    }
    await Retweet.query()
        .where('tweet_id', tweetId)
        .where('user_id', userId)
        .delete();
    return noContentResponse(res, 'Tweet unretweeted!');
}

module.exports = {
    CreateTweet,
    DeleteTweet,
    TimelineTweets,
    GetTweet,
    LikeTweet,
    UnlikeTweet,
    RetweetTweet,
    UnRetweetTweet
}
