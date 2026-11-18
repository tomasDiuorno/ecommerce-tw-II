import { NextFunction, Request, Response } from 'express';
import {
  obtenerTodosLosProductos,
  obtenerDestacados,
} from '../services/productoService.js';

export async function obtenerProductos(req: Request, res: Response, next: NextFunction) {
  try {
    const busqueda =
      typeof req.query.busqueda === 'string' ? req.query.busqueda : undefined;

    const productos = await obtenerTodosLosProductos(req.query.categoria, busqueda);
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