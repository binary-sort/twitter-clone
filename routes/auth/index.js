

const promiseRouter = require('express-promise-router');
const router = promiseRouter();

const AuthController = require('./../../controllers/auth');

router.post('/user', AuthController.CreateUser);

router.post('/login', AuthController.LoginUser);

module.exports = router;
