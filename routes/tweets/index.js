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

module.exports = router;
