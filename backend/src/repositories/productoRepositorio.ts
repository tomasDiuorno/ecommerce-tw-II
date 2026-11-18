import { pool } from '../config/database.js';
import type { Producto } from '../models/productoModel.js';

const SELECT_PRODUCTOS = `
  SELECT
    p.id,
    p.nombre,
    p.descripcion,
    c.nombre AS categoria,
    p.precio::float8 AS precio,
    p.imagen,
    p.disponible,
    p.destacado
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
`;

function escaparComodines(texto: string): string {
  return texto.replace(/[\\%_]/g, '\\$&');
}

export async function listarProductos(
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

export async function listarProductosDestacados(): Promise<Producto[]> {
  const resultado = await pool.query<Producto>(
    `${SELECT_PRODUCTOS}
     WHERE p.destacado = TRUE AND p.disponible = TRUE
     ORDER BY p.id`,
  );
  return resultado.rows;
}

export async function agregarStock(id:number, stock:number):Promise<void>{
  await pool.query(
    `UPDATE productos SET stock = stock + $1 WHERE productos.id = $2`,
     [stock, id]
  );
}

export async function quitarStock(id:number, stock:number):Promise<void>{
  await pool.query(
    `UPDATE productos SET stock = stock - $1 WHERE id = $2 AND stock >= $1`,
     [stock, id]
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
