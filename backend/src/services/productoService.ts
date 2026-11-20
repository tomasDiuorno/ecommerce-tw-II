
import { HttpError } from "../middlewares/HttpError.js";
import { crearProductoRepositorio, eliminarProductoRepositorio } from '../repositories/productoRepositorio.js';
import { existeCategoriaRepositorio } from '../repositories/categoriaRepositorio.js';
import { validarCrearProducto } from '../validators/productoValidator.js';
import { Producto } from "../models/productoModel.js";
import { ResultadoStock } from "../models/resultadoStock.js";
import { listarProductosDisponibles, listarProductosDestacados, agregarStock, quitarStock, obtenerProductoPorIdRepositorio, obtenerTodosLosProductos, deshabilitarDisponibilidad } from "../repositories/productoRepositorio.js";

export function obtenerTodosLosProductosDisponiblesServicio(categoria?: unknown, busqueda?: string): Promise<Producto[]> {
    let categoriaId: number | null = null;
    if (categoria !== undefined) {
        if (typeof categoria !== 'string' || !/^\d+$/.test(categoria)) {
            throw new HttpError(400, 'La categoría debe ser un número entero');
        }
        categoriaId = Number(categoria);
    }

    const texto = busqueda?.trim().slice(0, 100) || null;

    return listarProductosDisponibles(categoriaId, texto);
}

export function obtenerTodosLosProductosServicio(): Promise<Producto[]> {
    return obtenerTodosLosProductos();
}

export async function obtenerProductoPorIdServicio(id: number): Promise<Producto>{
    const producto = await obtenerProductoPorIdRepositorio(id);
    if(producto === undefined){
        throw new HttpError(404, "El producto ingresado no existe");
    } 
    return producto;
}

export function obtenerDestacados(): Promise<Producto[]> {
    return listarProductosDestacados();
}

export async function agregarStockServicio(id:number, stock:number): Promise<void>{
   if (!Number.isSafeInteger(id) || id <= 0) {
  throw new HttpError(400, 'El ID debe ser un entero positivo');
}

if (!Number.isSafeInteger(stock) || stock <= 0) {
  throw new HttpError(400, 'La cantidad debe ser un entero positivo');
}

    if(!await agregarStock(id, stock)){
       throw new HttpError(404, 'El producto no existe');
    }
}


export async function quitarStockProductoServicio(id: number, cantidad: number): Promise<number> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new HttpError(400, 'El ID debe ser un entero positivo');
  }

  if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
    throw new HttpError(400, 'La cantidad debe ser un entero positivo');
  }

  const resultado = await quitarStock(id, cantidad);

  switch (resultado.estado) {
    case 'no-encontrado':
      throw new HttpError(404, 'El producto no existe');

    case 'stock-insuficiente':
      throw new HttpError(409, 'El stock disponible es insuficiente');

    case 'actualizado':
      return resultado.stock;
  }
}

export async function crearProductoServicio(datos: unknown,): Promise<Producto> {
  const productoValidado = validarCrearProducto(datos);

  const categoriaExiste = await existeCategoriaRepositorio(productoValidado.categoriaId,);

  if (!categoriaExiste) {
    throw new HttpError(400, 'La categoría seleccionada no existe');
  }

  const id = await crearProductoRepositorio(productoValidado);

  return obtenerProductoPorIdServicio(id);
}

export async function eliminarProductoServicio(id: number,): Promise<void> {
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    throw new HttpError(400, 'El ID debe ser un entero entre 1 y 2147483647',);
  }

  const eliminado = await eliminarProductoRepositorio(id);

  if (!eliminado) {
    throw new HttpError(404, 'El producto no existe');
  }
}