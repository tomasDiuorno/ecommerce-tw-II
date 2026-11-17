/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.sql(`
    UPDATE categorias AS c
    SET imagen = datos.ruta
    FROM (
      VALUES
        ('Computadoras y notebooks', '/categorias/computadorasYNotebooks.webp'),
        ('Celulares y tablets', '/categorias/CelularesYTablets.webp'),
        ('Periféricos', '/categorias/Perifericos.webp'),
        ('Componentes de PC', '/categorias/ComponentesDePc.webp'),
        ('Audio y sonido', '/categorias/AudioYSonido.webp'),
        ('Redes y conectividad', '/categorias/RedesYConectividad.webp')
    ) AS datos(nombre, ruta)
    WHERE c.nombre = datos.nombre;
  `);
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.sql(`
    UPDATE categorias AS c
    SET imagen = NULL
    FROM (
      VALUES
        ('Computadoras y notebooks', '/categorias/computadorasYNotebooks.webp'),
        ('Celulares y tablets', '/categorias/CelularesYTablets.webp'),
        ('Periféricos', '/categorias/Perifericos.webp'),
        ('Componentes de PC', '/categorias/ComponentesDePc.webp'),
        ('Audio y sonido', '/categorias/AudioYSonido.webp'),
        ('Redes y conectividad', '/categorias/RedesYConectividad.webp')
    ) AS datos(nombre, ruta)
    WHERE c.nombre = datos.nombre
      AND c.imagen = datos.ruta;
  `);
}