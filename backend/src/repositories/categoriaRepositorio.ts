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