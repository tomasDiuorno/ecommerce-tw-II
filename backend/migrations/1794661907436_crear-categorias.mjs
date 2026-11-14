/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.sql(`
    CREATE TABLE categorias (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      color VARCHAR(120) NOT NULL,
      imagen TEXT
    );
  `);
}

export function down(pgm) {
  pgm.sql('DROP TABLE categorias;');
}