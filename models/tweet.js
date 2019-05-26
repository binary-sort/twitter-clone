const Model = require('objection').Model;

class Tweet extends Model {
  static get tableName() {
    return 'tweet';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tweet', 'user_id']
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/user',
        join: {
          from: 'tweet.user_id',
          to: 'user.id'
        }
      },

      children: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/tweet',
        join: {
          from: 'tweet.id',
          to: 'tweet.parent_id'
        }
      },

      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/tweet',
        join: {
          to: 'tweet.id',
          from: 'tweet.parent_id'
        }
      }
    }
  }
}

module.exports = Tweet;
