const Knex = require('knex');

/**
 *
 *
 * @param {Knex} knex
 */
exports.up = knex => {
  return knex.schema
    .createTable('user', table => {
      table.increments('id').primary();
      table
        .string('username')
        .notNullable();
      table
        .string('password')
        .notNullable();
      table.timestamps(true, true);
    })
};

exports.down = knex => {

};
