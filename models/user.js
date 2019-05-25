const ValidationError = require('objection').ValidationError;
const Model = require('objection').Model;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET;


class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'password'],

            properties: {
                username: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                }
            }
        }
    }

    static get relationMappings() {
        return {
            followers: {
                relation: Model.ManyToManyRelation,
                modelName: __dirname + '/user',
                join: {
                    from: 'user.id',
                    through: {
                        from: 'user_following.followed',
                        to: 'user_following.follower'
                    },
                    to: 'user.id'
                }
            },
            following: {
                relation: Model.ManyToManyRelation,
                modelName: __dirname + '/user',
                join: {
                    from: 'user.id',
                    through: {
                        from: 'user_following.follower',
                        to: 'user_following.followed'
                    },
                    to: 'user.id'
                }
            },
            user_following: {
                relation: Model.HasManyRelation,
                modelName: __dirname + '/follow',
                join: {
                    from: 'user.id',
                    to: 'user_following.follower'
                }
            },
            user_followed: {
                relation: Model.HasManyRelation,
                modelName: __dirname + '/follow',
                join: {
                    from: 'user.id',
                    to: 'user_following.followed'
                }
            },
            tweets: {
                relation: Model.HasManyRelation,
                modelName: __dirname + 'tweet',
                join: {
                    from: 'user.id',
                    to: 'tweet.user_id'
                }
            }
        }
    }

    async $beforeInsert() {
        await super.$beforeInsert();

        let result = await this.constructor.query().where('username', this.username).first();
        if (result) {
            throw new ValidationError({
                message: "Account with this username already esits!",
                type: "ModelValidation",
                data: {
                    message: "Account already exists with this username!",
                    verb: "Already exists"
                }
            });
        }
        this.password = await bcrypt.hash(this.password, 10);
    }

    async $beforeUpdate() {
        this.password ? this.password = await bcrypt.hash(this.password, 10) : null;
    }

    async comparePassword(password) {
        if (!password) {
            return false;
        }
        let pass = await bcrypt.compare(password, this.password);
        return pass;
    }

    async getJWT() {
        return await jwt.sign({
            user_id: this.id
        }, secret_key);
    }

    $formatJson(json, opt) {
        json = super.$formatJson(json, opt);
        json.password ? delete json.password : json
        return json;
    }
}

module.exports = User;
