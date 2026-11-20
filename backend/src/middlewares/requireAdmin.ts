import type { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuarioService.js';

const usuarioService = new UsuarioService();

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const usuarioId = req.session.usuarioId;

  if (!usuarioId) {
    res.status(401).json({
      mensaje: 'Debés iniciar sesión.',
    });
    return;
  }

  try {
    const usuario = await usuarioService.buscarPorId(usuarioId);

    if (!usuario) {
      res.status(401).json({
        mensaje: 'El usuario de la sesión ya no existe.',
      });
      return;
    }

    if (usuario.rol !== 'admin') {
      res.status(403).json({
        mensaje: 'No tenés permisos para realizar esta operación.',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
