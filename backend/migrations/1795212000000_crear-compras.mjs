export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE compras (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      direccion VARCHAR(255) NOT NULL,
      codigo_postal VARCHAR(8) NOT NULL,
      subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
      costo_envio NUMERIC(12, 2) NOT NULL CHECK (costo_envio >= 0),
      total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
      estado VARCHAR(30) NOT NULL DEFAULT 'confirmada'
    );

    CREATE TABLE detalle_compras (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      compra_id INTEGER NOT NULL REFERENCES compras(id),
      producto_id INTEGER NOT NULL REFERENCES productos(id),
      nombre_producto VARCHAR(150) NOT NULL,
      cantidad INTEGER NOT NULL CHECK (cantidad > 0),
      precio_unitario NUMERIC(12, 2) NOT NULL CHECK (precio_unitario >= 0)
    );

    CREATE INDEX idx_compras_usuario_id ON compras(usuario_id);
    CREATE INDEX idx_detalle_compras_compra_id ON detalle_compras(compra_id);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE detalle_compras;
    DROP TABLE compras;
  `);
};