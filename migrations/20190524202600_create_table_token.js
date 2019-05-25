const Knex = require('knex');

/**
 *
 *
 * @param {Knex} knex
 */
exports.up = knex => {
  return knex.schema
    .createTable('auth_token', table => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('id')
        .inTable('user')
        .notNullable()
        .onDelete('CASCADE');
      table
        .string('token')
        .notNullable();
      table.timestamps(false, true);
    })
};

exports.down = knex => {

};
