import type { Request, Response, NextFunction } from 'express';
import { listarComprasUsuario, realizarCompra } from '../services/compraService.js';

export async function confirmarCompra(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Debés iniciar sesión para comprar'
      });
    }

    const compra = await realizarCompra(usuarioId, req.body);

    return res.status(201).json({
      mensaje: 'Compra realizada correctamente',
      compra
    });

  } catch (error) {
    next(error);
  }
}

export async function obtenerMisCompras(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: 'Debés iniciar sesión'
      });
    }

    const compras = await listarComprasUsuario(usuarioId);

    return res.status(200).json({ compras });

  } catch (error) {
    next(error);
  }
}
