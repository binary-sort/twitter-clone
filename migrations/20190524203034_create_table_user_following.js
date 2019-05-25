const Knex = require('knex');

/**
 *
 *
 * @param {Knex} knex
 */
exports.up = knex => {
  return knex.schema
    .createTable('user_following', table => {
      table.increments('id').primary();
      table
        .integer('follower')
        .references('id')
        .inTable('user')
        .notNullable()
        .onDelete('CASCADE');
      table
        .integer('followed')
        .references('id')
        .inTable('user')
        .notNullable()
        .onDelete('CASCADE');
      table.timestamps(false, true);
    })
};

exports.down = knex => {

};
