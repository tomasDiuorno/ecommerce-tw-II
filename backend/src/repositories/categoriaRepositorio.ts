import { pool } from '../config/database.js';
import type { Categoria } from '../models/categoriaModel.js';


export async function listarCategorias(): Promise<Categoria[]> {
  const resultado = await pool.query<Categoria>(`
    SELECT id, nombre, color, imagen
    FROM categorias
    ORDER BY nombre;
  `);

  return resultado.rows;
}

export async function existeCategoriaRepositorio(id: number,): Promise<boolean> {
  const resultado = await pool.query<{ id: number }>(
    'SELECT id FROM categorias WHERE id = $1', [id],
 );

  return resultado.rows.length > 0;
}