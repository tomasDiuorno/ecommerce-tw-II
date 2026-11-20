import { HttpError } from '../middlewares/HttpError.js';
import {
  validarDestino,
  validarItems
} from './envioValidator.js';

export function validarCompra(datos: unknown) {
  if (typeof datos !== 'object' || datos === null) {
    throw new HttpError(400, 'Los datos de la compra no son válidos');
  }

  const compra = datos as Record<string, unknown>;

  const destino = validarDestino(
    compra.direccion,
    compra.codigoPostal
  );

  const items = validarItems(compra.items);

  if (items.length === 0) {
    throw new HttpError(400, 'El carrito está vacío');
  }

  if (
    compra.metodoPago !== 'contraEntrega' &&
    compra.metodoPago !== 'online'
  ) {
    throw new HttpError(400, 'El método de pago no es válido');
  }

  return {
    ...destino,
    items,
    metodoPago: compra.metodoPago
  };
}