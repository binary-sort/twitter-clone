const Model = require('objection').Model;

class Likes extends Model {
  static get tableName() {
    return 'tweet_likes';
  }

  static get relationMappings() {
    return {
      tweet: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/tweet',
        join: {
          from: 'tweet_likes.tweet_id',
          to: 'tweet.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/user',
        join: {
          from: 'tweet_likes.user_id',
          to: 'user.id'
        }
      },
    }
  }
}

module.exports = Likes;
