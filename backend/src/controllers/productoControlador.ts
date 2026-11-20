import { NextFunction, Request, Response } from 'express';
import {
  obtenerTodosLosProductosDisponiblesServicio,
  obtenerDestacados,
  obtenerProductoPorIdServicio,
  obtenerTodosLosProductosServicio,
  agregarStockServicio,
  quitarStockProductoServicio,
  crearProductoServicio,
  eliminarProductoServicio
} from '../services/productoService.js';
import { HttpError } from '../middlewares/HttpError.js';

export async function obtenerProductosDisponibles(req: Request, res: Response, next: NextFunction) {
  try {
    const busqueda = typeof req.query.busqueda === 'string' ? req.query.busqueda : undefined;
    const productos = await obtenerTodosLosProductosDisponiblesServicio(req.query.categoria, busqueda);
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

export async function obtenerProductos(req:Request, res: Response, next: NextFunction) {
  try {
    const productos = await obtenerTodosLosProductosServicio();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

export async function obtenerProductosDestacados(req: Request, res: Response, next: NextFunction) {
  try {
    const destacados = await obtenerDestacados();
    res.json(destacados);
  } catch (error) {
    next(error);
  }
}

export async function obtenerProductoPorId(req: Request, res: Response, next: NextFunction){
  try{
     const id = verificarNumeroYPositivo(req.params.id);

    const producto = await obtenerProductoPorIdServicio(id);
 res.json(producto);
  } catch (error) {
    next(error);
  }
}

  export async function agregarStock(req: Request, res:Response, next: NextFunction){
    const id = verificarNumeroYPositivo(req.params.id);
     const stock = verificarNumeroYPositivo(req.body?.stock);
    try{
   await agregarStockServicio(id, stock);
   res.status(204).send();
    } catch(error){
      next(error);
    }
    
  }
  export async function quitarStock(req: Request, res:Response, next: NextFunction){
    const id = verificarNumeroYPositivo(req.params.id);
    const stock = verificarNumeroYPositivo(req.body?.stock);
    try{
   await quitarStockProductoServicio(id, stock);
   res.status(204).send();
    } catch(error){
      next(error);
    }
    
  }

function verificarNumeroYPositivo(valor: unknown): number {
  if (typeof valor !== 'string' && typeof valor !== 'number') {
    throw new HttpError(400, 'El valor debe ser un número entero positivo');
  }

  if (typeof valor === 'string' && !/^\d+$/.test(valor)) {
    throw new HttpError(400, 'El valor debe ser un número entero positivo');
  }

  const numero = Number(valor);

  if (!Number.isSafeInteger(numero) || numero <= 0) {
    throw new HttpError(400, 'El valor debe ser un número entero positivo');
  }

  return numero;
}

export async function crearProducto(req: Request, res: Response, next: NextFunction,): Promise<void> {
  try {
    const datos: unknown = req.body;

    const productoCreado = await crearProductoServicio(datos);

    res.status(201).json(productoCreado);
  } catch (error) {
    next(error);
  }
}

export async function eliminarProducto(req: Request, res: Response, next: NextFunction,): Promise<void> {
  try {
    const id = verificarNumeroYPositivo(req.params.id);

    await eliminarProductoServicio(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}