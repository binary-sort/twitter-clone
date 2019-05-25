

const Model = require('objection').Model;

class Follow extends Model {
  static get tableName() {
    return 'user_following';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['follower', 'followed']
    }
  }
}

module.exports = Follow;
