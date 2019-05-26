const promiseRouter = require('express-promise-router');
const router = promiseRouter();

const passport = require('passport');
require('./../../middleware/passport')(passport);

const TweetsController = require('./../../controllers/tweets');

router.get('/timeline', passport.authenticate('jwt', {
  session: false
}), TweetsController.TimelineTweets);

router.get('/tweet/:tweetId', passport.authenticate('jwt', {
  session: false
}), TweetsController.GetTweet)

router.post('/tweet', passport.authenticate('jwt', {
  session: false
}), TweetsController.CreateTweet);

router.delete('/tweet/:tweetId', passport.authenticate('jwt', {
  session: false
}), TweetsController.DeleteTweet);

router.post('/like/tweet/:tweetId', passport.authenticate('jwt', {
  session: false
}), TweetsController.LikeTweet);

router.delete('/unlike/tweet/:tweetId', passport.authenticate('jwt', {
  session: false
}), TweetsController.UnlikeTweet);

router.post('/retweet/tweet/:tweetId', passport.authenticate('jwt', {
  session: false
}), TweetsController.RetweetTweet);

router.delete('/unretweet/tweet/:tweetId', passport.authenticate('jwt', {
  session: false
}), TweetsController.UnRetweetTweet);

module.exports = router;
