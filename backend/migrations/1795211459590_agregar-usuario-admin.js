/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    INSERT INTO usuarios (email, contrasenia_hash, nombre, apellido, direccion, rol)
    VALUES (
      'admin@admin.com',
      '$2b$10$CWwdIcamvIzMe5bgj1bGx.aMcjgXYkA2e.ldEErfSUZYCspkZvHgS',
      'Administrador',
      'Sistema',
      'Sin dirección',
      'admin'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DELETE FROM usuarios WHERE email = 'admin@admin.com' AND rol = 'admin';
  `);
};
