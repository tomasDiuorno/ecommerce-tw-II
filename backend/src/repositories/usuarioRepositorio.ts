
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
      direccion
    FROM usuarios
    WHERE email = $1
    LIMIT 1;
  `, [email]);

  return resultado.rows[0] ?? null;
}

// Registrar un usuario
export async function crearUsuario(
  usuario: Omit<UsuarioDB, 'id'>
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

export async function buscarUsuarioPorId(id: number): Promise<UsuarioDB | null> {
  const resultado = await pool.query<UsuarioDB>(`
    SELECT id, email, contrasenia_hash AS "contraseniaHash", nombre, apellido, direccion
    FROM usuarios
    WHERE id = $1
    LIMIT 1;
  `, [id]);

  return resultado.rows[0] ?? null;
}

export async function actualizarUsuario(
  id: number,
  datos: {
    email: string;
    nombre: string;
    apellido: string;
    direccion: string;
  }
): Promise<Omit<UsuarioDB, "contraseniaHash"> | null> {
  
  const resultado = await pool.query<Omit<UsuarioDB, "contraseniaHash">>(`
    UPDATE usuarios
    SET email = $1, nombre = $2, apellido = $3, direccion = $4
    WHERE id = $5
    RETURNING id, email, nombre, apellido, direccion; 
  `, 
  [datos.email, datos.nombre, datos.apellido, datos.direccion, id]);

  return resultado.rows[0] ?? null;
}