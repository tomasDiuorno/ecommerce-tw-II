import { NextFunction, Request, Response } from 'express';
import {
  obtenerTodosLosProductosDisponiblesServicio,
  obtenerDestacados,
  obtenerProductoPorIdServicio,
  obtenerTodosLosProductosServicio,
  agregarStockServicio,
  crearProductoServicio
} from '../services/productoService.js';
import { HttpError } from '../middlewares/HttpError.js';

export async function obtenerProductosDisponibles(req: Request, res: Response, next: NextFunction) {
  try {
    const productos = await obtenerTodosLosProductosDisponiblesServicio(req.query.categoria);
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
    const stock = verificarNumeroYPositivo(req.body.stock);
    try{
   await agregarStockServicio(id, stock);
    } catch(error){
      next(error);
    }

  }

function verificarNumeroYPositivo(valor: unknown): number {
      if (typeof valor !== 'string' || !/^\d+$/.test(valor)) {
    throw new HttpError(400, 'El valor debe ser un número entero positivo');
  }

  const valorVerificado = Number(valor);

  if (!Number.isSafeInteger(valorVerificado) || valorVerificado <= 0) {
    throw new HttpError(400, 'El valor debe ser un número entero positivo');
  }

  return valorVerificado;
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