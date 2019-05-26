const Knex = require('knex');

/**
 *
 *
 * @param {Knex} knex
 */
exports.up = knex => {
  return knex.schema
    .table('tweet', table => {
      table
        .integer('parent_id')
        .references('id')
        .inTable('tweet')
        .onDelete('CASCADE');
    })
};

exports.down = knex => {

};
