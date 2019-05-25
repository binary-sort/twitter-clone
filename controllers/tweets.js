const Tweets = require('../models/tweet');

const CreateTweet = async (req, res) => {
    let payload = {
        user_id: req.user.id,
        tweet: req.body.tweet
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
        .orderBy('created_at', 'DESC');
    return okResponse(res, tweets);
}

const GetTweet = async (req, res) => {
    let tweetId = req.params.tweetId;
    if (!+tweetId) {
        throw notFoundError('Tweet not found!');
    }
    let tweet = await Tweets.query().findById(+tweetId);
    if (!tweet) {
        throw notFoundError('Tweet not Found!');
    }
    return okResponse(res, tweet);
}

module.exports = {
    CreateTweet,
    DeleteTweet,
    TimelineTweets,
    GetTweet
}
