const Knex = require('knex');

/**
 *
 *
 * @param {Knex} knex
 */
exports.up = knex => {
  return knex.schema
    .createTable('retweet', table => {
      table.increments('id').primary();
      table
        .integer('tweet_id')
        .references('id')
        .inTable('tweet')
        .notNullable()
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .references('id')
        .inTable('user')
        .notNullable()
        .onDelete('CASCADE');
      table.timestamps(false, true);
    })
};

exports.down = knex => {

};
