

const Model = require('objection').Model;

class Token extends Model {
    static get tableName() {
        return 'auth_token';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['token'],

            properties: {
                token: {
                    type: 'string'
                }
            }
        }
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/user',
                join: {
                    from: 'auth_token.user_id',
                    to: 'user.id'
                }
            }
        }
    }

    $formatJson(json, opt) {
        json = super.$formatJson(json, opt);
        delete json.user_id, json.id;
        return json
    }
}

module.exports = Token
