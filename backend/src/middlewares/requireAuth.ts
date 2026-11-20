import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const usuarioId = req.session.usuarioId;
  if (!usuarioId) {
    return res.status(401).json({
      mensaje: "Debes iniciar sesión para acceder a este recurso"
    });
  }
  next();
}