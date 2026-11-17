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
    p.stock,
    p.disponible,
    p.destacado
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
`;

export async function listarProductosDisponibles(categoriaId: number | null): Promise<Producto[]> {
  const resultado = await pool.query<Producto>(
    `${SELECT_PRODUCTOS}
     WHERE ($1::int IS NULL OR p.categoria_id = $1) AND p.disponible = TRUE
     ORDER BY p.id`,
    [categoriaId],
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

export async function quitarStock(id:number, stock:number):Promise<boolean>{
  const resultado =await pool.query(
    `UPDATE productos SET stock = stock - $1 WHERE id = $2 AND stock >= $1`,
     [stock, id]
  );
   return resultado.rowCount === 1;
}