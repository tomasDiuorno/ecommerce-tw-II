/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE usuarios
    ADD COLUMN rol VARCHAR(5) NOT NULL DEFAULT 'user'
    CONSTRAINT usuarios_rol_check CHECK (rol IN ('user', 'admin'));
  `);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE usuarios
    DROP COLUMN rol;
  `);
};