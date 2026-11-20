import { HttpError } from '../middlewares/HttpError.js';
import { obtenerProductosParaEnvio } from '../repositories/productoRepositorio.js';
import type { ItemParaEnvio } from '../validators/envioValidator.js';
export type ZonaEnvio = 'sanJusto' | 'amba' | 'restoDelPais';

const TARIFAS: Record<ZonaEnvio, number> = {sanJusto: 1500, amba: 3000,restoDelPais: 6000,};

const MONTO_ENVIO_GRATIS = 100_000;

export function calcularCostoEnvio( subtotal: number, zona: ZonaEnvio,): number {
  if (subtotal === 0) {
    return 0;
  } if (subtotal > MONTO_ENVIO_GRATIS) {
    return 0;
  } return TARIFAS[zona];
}

export function determinarZona(codigoPostal: string): ZonaEnvio {
  const esCpa = /^[A-Z]/.test(codigoPostal);

  const numeroPostal = Number(esCpa ? codigoPostal.slice(1, 5) : codigoPostal,);

  const provincia = esCpa ? codigoPostal.charAt(0) : null;

  // B: Buenos Aires. C: Ciudad Autónoma de Buenos Aires.
  if (provincia !== null && provincia !== 'B' && provincia !== 'C') {
    return 'restoDelPais';
  }

  if (numeroPostal === 1754 && provincia !== 'C') {
    return 'sanJusto';
  }

  if (numeroPostal >= 1000 && numeroPostal <= 1899) {
    return 'amba';
  }

  return 'restoDelPais';
}

export async function cotizarEnvio(items: ItemParaEnvio[],codigoPostal: string,) {
  const zona = determinarZona(codigoPostal);

  if (items.length === 0) {
    return {subtotal: 0, envio: 0, total: 0, zona,};
  }

  const ids = items.map(item => item.productoId);
  const productos = await obtenerProductosParaEnvio(ids);

  let subtotalCentavos = 0;

  for (const item of items) {
    const producto = productos.find(producto => producto.id === item.productoId,);

    if (!producto) {
      throw new HttpError(400,`El producto ${item.productoId} no existe o no está disponible`,);
    }

    const precioCentavos = Math.round(producto.precio * 100);
    subtotalCentavos += precioCentavos * item.cantidad;
  }

  if (!Number.isSafeInteger(subtotalCentavos)) {
    throw new HttpError(400, 'El importe del carrito es demasiado grande');
  }

  const subtotal = subtotalCentavos / 100;
  const envio = calcularCostoEnvio(subtotal, zona);

  return {
    subtotal,
    envio,
    total: (subtotalCentavos + envio * 100) / 100,
    zona,
  };
}
