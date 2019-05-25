const Knex = require('knex');

/**
 *
 *
 * @param {Knex} knex
 */
exports.up = knex => {
  return knex.schema
    .createTable('tweet', table => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('id')
        .inTable('user')
        .notNullable()
        .onDelete('CASCADE');
      table.string('tweet');
      table.timestamps(false, true);
    })
};

exports.down = knex => {

};
