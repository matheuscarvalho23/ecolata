import Knex from "knex";

/**
 * Create table points_items
 *
 * @export
 * @param {Knex} knex
 * @returns
 */
export async function up(knex: Knex) {
  return knex.schema.createTable("points_items", (table) => {
    table.increments("id").primary();

    table.integer("point_id")
      .notNullable()
      .references("id")
      .inTable("points");

    table.integer("item_id")
      .notNullable()
      .references("id")
      .inTable("points");
  });
}

/**
 * Drop table points_items
 *
 * @export
 * @param {Knex} knex
 * @returns
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable("points_items");
}
