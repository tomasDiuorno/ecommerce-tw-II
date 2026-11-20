import { pool } from '../config/database.js';
import type { Producto, CrearProducto } from '../models/productoModel.js';
import { ResultadoQuitarStock } from '../models/resultadoQuitarStock.js';
import { ResultadoStock } from '../models/resultadoStock.js';

const SELECT_PRODUCTOS = `
  SELECT
    p.id,
    p.nombre,
    p.descripcion,
    c.nombre AS categoria,
    p.precio::float8 AS precio,
    p.imagen,
    p.stock,
    p.disponible,
    p.destacado
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
`;

function escaparComodines(texto: string): string {
  return texto.replace(/[\\%_]/g, '\\$&');
}

export async function listarProductosDisponibles(
  categoriaId: number | null,
  busqueda: string | null,
): Promise<Producto[]> {
  const patron = busqueda ? `%${escaparComodines(busqueda)}%` : null;

  const resultado = await pool.query<Producto>(
    `${SELECT_PRODUCTOS}
     WHERE ($1::int IS NULL OR p.categoria_id = $1)
       AND ($2::text IS NULL OR p.nombre ILIKE $2)
       AND p.disponible = TRUE
     ORDER BY p.id`,
    [categoriaId, patron],
  );
  return resultado.rows;
}

export async function obtenerTodosLosProductos(): Promise<Producto[]> {
  const resultado = await pool.query<Producto>(SELECT_PRODUCTOS);
  return resultado.rows;
}

export async function obtenerProductoPorIdRepositorio(id: number): Promise<Producto | undefined>{
      const resultado = await pool.query<Producto>(
        `${SELECT_PRODUCTOS}  WHERE p.id = $1`, [id]);
        return resultado.rows[0];
}

export async function listarProductosDestacados(): Promise<Producto[]> {
  const resultado = await pool.query<Producto>(
    `${SELECT_PRODUCTOS}
     WHERE p.destacado = TRUE AND p.disponible = TRUE
     ORDER BY p.id`,
  );
  return resultado.rows;
}

export async function agregarStock(id:number, stock:number):Promise<boolean>{
  const resultado = await pool.query(
    `UPDATE productos SET stock = stock + $1 WHERE productos.id = $2`,
     [stock, id]
  );

   return resultado.rowCount === 1;
}

export async function quitarStock(
  id: number,
  cantidad: number,
): Promise<ResultadoQuitarStock> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const resultado = await client.query<{ stock: number }>(
      'SELECT stock FROM productos WHERE id = $1 FOR UPDATE',
      [id],
    );

    const producto = resultado.rows[0];

    if (!producto) {
      await client.query('ROLLBACK');
      return { estado: 'no-encontrado' };
    }

    if (producto.stock < cantidad) {
      await client.query('ROLLBACK');
      return { estado: 'stock-insuficiente' };
    }

    const actualizado = await client.query<{ stock: number }>(
      `UPDATE productos
       SET stock = stock - $1,
        disponible = CASE
      WHEN stock - $1 = 0 THEN false
      ELSE disponible
    END
       WHERE id = $2
       RETURNING stock`,
      [cantidad, id],
    );

    const productoActualizado = actualizado.rows[0];

    if (!productoActualizado) {
      throw new Error('No se pudo actualizar el producto bloqueado');
    }

    await client.query('COMMIT');

    return {
      estado: 'actualizado',
      stock: productoActualizado.stock,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deshabilitarDisponibilidad(id: number): Promise<void>{
   const resultado =await pool.query(
    `UPDATE productos SET disponible = false WHERE id = $1`,
     [id]
  );
}

export interface ProductoParaEnvio {id: number;precio: number;}

export async function obtenerProductosParaEnvio( ids: number[],):
 Promise<ProductoParaEnvio[]> {
  const resultado = await pool.query<ProductoParaEnvio>(
    `SELECT id, precio::float8 AS precio
     FROM productos
     WHERE id = ANY($1::int[])
       AND disponible = TRUE`,
    [ids],
  );

  return resultado.rows;
}

export async function crearProductoRepositorio(producto: CrearProducto,): Promise<number> {
  const resultado = await pool.query<{ id: number }>(
    `INSERT INTO productos (nombre, descripcion, categoria_id, precio, imagen, stock, disponible, destacado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`,
    [
      producto.nombre,
      producto.descripcion,
      producto.categoriaId,
      producto.precio,
      producto.imagen,
      producto.stock,
      producto.disponible,
      producto.destacado,
    ],
  );

  const productoCreado = resultado.rows[0];

  if (productoCreado === undefined) {
    throw new Error('La inserción no devolvió el ID del producto');
  }

  return productoCreado.id;
}
