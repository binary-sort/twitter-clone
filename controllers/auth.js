const User = require('./../models/user');
const Token = require('./../models/token');

const CreateUser = async (req, res) => {
    let data = req.body;
    let created_user = await User.query().insertAndFetch(data);
    let token = await created_user.getJWT();
    let inserted_token = await Token.query().insertAndFetch({
        token: token,
        user_id: created_user.id
    });
    res.setHeader('Authorization', 'Bearer ' + inserted_token.token);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    return createdResponse(res, created_user.toJSON(), 'Account Created');
}

const LoginUser = async (req, res) => {
    let data = req.body;
    let user = await User.query().skipUndefined().where('username', data.username).first();
    if (!user) {
        throw badRequestError('User with this username doesn\'t exist');
    }
    if (!await user.comparePassword(data.password)) {
        throw badRequestError('Incorrect Password!');
    }
    let token = await user.getJWT();
    let inserted_token = await Token.query().insertAndFetch({
        token: token,
        user_id: user.id
    });
    res.setHeader('Authorization', 'Bearer ' + inserted_token.token);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    return okResponse(res, user.toJSON());
}

const GetUserDetails = async (req, res) => {
    let data = req.user;
    return okResponse(res, data);
}

const GetUsersList = async (req, res) => {
    let data = await User.query();
    return okResponse(res, data);
}

module.exports = {
    CreateUser,
    LoginUser,
    GetUserDetails,
    GetUsersList
}
