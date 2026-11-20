
import { pool } from '../config/database.js';
import { UsuarioDB } from '../models/usuarioModel.js';


export async function buscarUsuarioPorEmail(
  email: string
): Promise<UsuarioDB | null> {

  const resultado = await pool.query<UsuarioDB>(`
    SELECT
      id,
      email,
      contrasenia_hash AS "contraseniaHash",
      nombre,
      apellido,
      direccion,
      rol
    FROM usuarios
    WHERE email = $1
    LIMIT 1;
  `, [email]);

  return resultado.rows[0] ?? null;
}

// Registrar un usuario
export async function crearUsuario(
  usuario: Omit<UsuarioDB, 'id' | 'rol'>
): Promise<UsuarioDB> {

  const resultado = await pool.query<UsuarioDB>(`
    INSERT INTO usuarios (
      email,
      contrasenia_hash,
      nombre,
      apellido,
      direccion
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      email,
      contrasenia_hash AS "contraseniaHash",
      nombre,
      apellido,
      direccion;
  `, [
    usuario.email,
    usuario.contraseniaHash,
    usuario.nombre,
    usuario.apellido,
    usuario.direccion
  ]);

  return resultado.rows[0];
}

export async function buscarUsuarioPorId(
  id: number,
): Promise<UsuarioDB | null> {
  const resultado = await pool.query<UsuarioDB>(`
    SELECT
      id,
      email,
      contrasenia_hash AS "contraseniaHash",
      nombre,
      apellido,
      direccion,
      rol
    FROM usuarios
    WHERE id = $1
    LIMIT 1;
  `, [id]);

  return resultado.rows[0] ?? null;
}