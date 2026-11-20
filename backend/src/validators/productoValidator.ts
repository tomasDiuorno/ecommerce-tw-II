import type { CrearProducto } from '../models/productoModel.js';
import { HttpError } from '../middlewares/HttpError.js';

export function validarCrearProducto(datos: unknown): CrearProducto {
  if (typeof datos !== 'object' || datos === null || Array.isArray(datos)) {
    throw new HttpError(400, 'Los datos del producto no son válidos');
  }

  const campos = datos as Record<string, unknown>;

  const {nombre, descripcion, categoriaId, precio, imagen, stock, disponible, destacado, } = campos;

  if ( typeof nombre !== 'string' || nombre.trim().length === 0 || nombre.trim().length > 150) {
    throw new HttpError(400, 'El nombre debe tener entre 1 y 150 caracteres');
  }

  if (typeof descripcion !== 'string' || descripcion.trim().length === 0) {
    throw new HttpError(400, 'La descripción es obligatoria');
  }

  if ( typeof categoriaId !== 'number' || !Number.isInteger(categoriaId) || categoriaId <= 0 || categoriaId > 2147483647) {
    throw new HttpError(400, 'El ID de categoría no es válido');
  }

  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0 || precio > 99999999.99 || !/^\d+(\.\d{1,2})?$/.test(String(precio))) {
    throw new HttpError(400, 'El precio debe estar entre 0 y 99999999.99 y tener como máximo dos decimales');
  }

  if (imagen !== null && typeof imagen !== 'string') {
    throw new HttpError(400, 'La imagen debe ser un texto o null');
  }

  if ( typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0 || stock > 2147483647) {
    throw new HttpError(400, 'El stock debe ser un entero entre 0 y 2147483647');
  }

  if (typeof disponible !== 'boolean') {
    throw new HttpError(400, 'Disponible debe ser un valor booleano');
  }

  if (typeof destacado !== 'boolean') {
    throw new HttpError(400, 'Destacado debe ser un valor booleano');
  }

  return {
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
    categoriaId,
    precio,
    imagen: imagen === null ? null : imagen.trim() || null,
    stock,
    disponible: stock > 0 && disponible,
    destacado,
  };
}
