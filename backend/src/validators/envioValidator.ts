import { HttpError } from '../middlewares/HttpError.js';

export function validarDestino( direccion: unknown, codigoPostal: unknown,) {
  if (typeof direccion !== 'string' || direccion.trim() === '') {
    throw new HttpError(400, 'La dirección es obligatoria');
  }

  if (typeof codigoPostal !== 'string') {
    throw new HttpError(400, 'El código postal es obligatorio');
  }

  const codigoNormalizado = codigoPostal.replace(/\s+/g, '').toUpperCase();

  const formatoValido = /^(?:[0-9]{4}|[A-Z][0-9]{4}(?:[A-Z]{3})?)$/.test(codigoNormalizado);

  if (!formatoValido) {
    throw new HttpError(400, 'Ingresá 4 números, una letra y 4 números (X5000), o un CPA completo');
  }
  return {
    direccion: direccion.trim(),
    codigoPostal: codigoNormalizado,
  };
}

export interface ItemParaEnvio { productoId: number; cantidad: number;}

export function validarItems(items: unknown): ItemParaEnvio[] {
  if (!Array.isArray(items)) {
    throw new HttpError(400, 'Los productos deben enviarse como una lista');
  }

  const idsEncontrados = new Set<number>();

  return items.map((item: unknown) => {
    if (typeof item !== 'object' || item === null || !('productoId' in item) || !('cantidad' in item)) {
      throw new HttpError(400,'Cada producto debe incluir productoId y cantidad',);
    }

    const { productoId, cantidad } = item;

    if (typeof productoId !== 'number' ||!Number.isSafeInteger(productoId) || productoId <= 0) {
      throw new HttpError(400, 'El identificador del producto no es válido');
    }

    if (typeof cantidad !== 'number' ||!Number.isSafeInteger(cantidad) ||cantidad <= 0) {
      throw new HttpError( 400,'La cantidad debe ser un número entero mayor a cero',);
    }

    if (idsEncontrados.has(productoId)) {
      throw new HttpError(400, 'No se puede repetir el mismo producto');
    }

    idsEncontrados.add(productoId);

    return { productoId, cantidad };
  });
}
