/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export function up(pgm) {
  pgm.sql(`
    INSERT INTO categorias (nombre, color, imagen)
    VALUES
      ('Computadoras y notebooks', '#4F46E5', NULL),
      ('Celulares y tablets', '#0369A1', NULL),
      ('Periféricos', '#7E22CE', NULL),
      ('Componentes de PC', '#047857', NULL),
      ('Audio y sonido', '#BE123C', NULL),
      ('Redes y conectividad', '#B45309', NULL);
  `);
}

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export function down(pgm) {
  pgm.sql(`
    DELETE FROM categorias
    WHERE nombre IN (
      'Computadoras y notebooks',
      'Celulares y tablets',
      'Periféricos',
      'Componentes de PC',
      'Audio y sonido',
      'Redes y conectividad'
    );
  `);
}
