

const Follow = require('./../models/follow');

const FollowUser = async (req, res) => {
  const userId = req.params.userId;
  const authUserId = req.user.id;

  let following = await Follow.query()
    .where('follower', authUserId)
    .where('followed', userId)
    .first();
  if (following) {
    throw badRequestError('Already following this user!')
  }
  following = await Follow.query().insert({
    follower: authUserId,
    followed: userId
  }).returning('*');
  return okResponse(res, following, 'Started following user!');
}

const UnfollowUser = async (req, res) => {
  const userId = req.params.userId;
  const authUserId = req.user.id;

  let following = await Follow.query()
    .where('follower', authUserId)
    .where('followed', userId)
    .first();
  if (following) {
    await following.$query().delete();
    return noContentResponse(res, 'User unfollowed!');
  }
  throw badRequestError('Already not following this user!');
}

module.exports = {
  FollowUser,
  UnfollowUser
}
