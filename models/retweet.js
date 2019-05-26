const Model = require('objection').Model;

class Retweet extends Model {
  static get tableName() {
    return 'retweet';
  }

  static get relationMappings() {
    return {
      tweet: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/tweet',
        join: {
          from: 'retweet.tweet_id',
          to: 'tweet.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/user',
        join: {
          from: 'retweet.user_id',
          to: 'user.id'
        }
      },
    }
  }
}

module.exports = Retweet;
