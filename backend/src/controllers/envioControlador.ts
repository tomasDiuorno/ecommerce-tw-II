import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../middlewares/HttpError.js';
import { cotizarEnvio } from '../services/envioService.js';
import {validarDestino,validarItems,} from '../validators/envioValidator.js';

export async function obtenerCotizacionEnvio(
  req: Request, res: Response, next: NextFunction,) {
  try {
    const body: unknown = req.body;

    if ( typeof body !== 'object' || body === null || !('direccion' in body) || !('codigoPostal' in body) ||!('items' in body)) {
      throw new HttpError(400,'Debés enviar dirección, código postal y productos',);
    }

    const destino = validarDestino(body.direccion, body.codigoPostal);
    const items = validarItems(body.items);

    const cotizacion = await cotizarEnvio(items, destino.codigoPostal);

    res.json(cotizacion);
  } catch (error) {
    next(error);
  }
}