import type { Request, Response, NextFunction } from 'express';
import { HttpError } from './HttpError.js';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) { //Este código le delega el manejo de errores a Express si la respuesta ya se envió, por ej: En medio del envío de un archivo
    next(error); //Deja de usar este controlador y Express se encarga de cerrar la conexión y dar por fallida la petición
    return;
  }
if (error instanceof HttpError) { // Esto sirve para manejar errores propios, por ejemplo, si nuestra base de datos no devuelve ninguna categoría
  res.status(error.statusCode).json({ //Eso en sí no es un error, pero nosotros lanzamos manualmente un 404. lo mismo que las excepciones personalizadas
    mensaje: error.message,
  });
  return;
}

console.error(error);

res.status(500).json({ //Si no es una excepción personalizada, mandamos mensaje genérico
  mensaje: 'Ocurrió un error interno en el servidor',
});
}