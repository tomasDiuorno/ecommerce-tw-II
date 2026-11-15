/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export function up(pgm) {
  pgm.sql(`
    CREATE TABLE productos (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT NOT NULL,
      categoria_id INTEGER NOT NULL REFERENCES categorias(id),
      precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
      imagen TEXT,
      disponible BOOLEAN NOT NULL DEFAULT TRUE,
      destacado BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);
  `);
}

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export function down(pgm) {
  pgm.sql('DROP TABLE productos;');
}