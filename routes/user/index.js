const promiseRouter = require('express-promise-router');
const router = promiseRouter();

const passport = require('passport');
require('./../../middleware/passport')(passport);

const UserController = require('./../../controllers/user');

router.post('/follow/:userId', passport.authenticate('jwt', {
  session: false
}), UserController.FollowUser);

router.delete('/unfollow/:userId', passport.authenticate('jwt', {
  session: false
}), UserController.UnfollowUser);

module.exports = router;
