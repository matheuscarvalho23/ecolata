import Knex from "knex";

/**
 * Create table items
 *
 * @export
 * @param {Knex} knex
 * @returns
 */
export async function up(knex: Knex) {
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary();

    table.string("image").notNullable();
    table.string("title").notNullable();
  });
}

/**
 * Drop table items
 *
 * @export
 * @param {Knex} knex
 * @returns
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable("items");
}
