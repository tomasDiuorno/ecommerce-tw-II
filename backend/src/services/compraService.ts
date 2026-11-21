import { validarCompra } from '../validators/compraValidator.js';
import { obtenerComprasPorUsuario, registrarCompra } from '../repositories/compraRepositorio.js';

export async function realizarCompra(
  usuarioId: number,
  datos: unknown
) {
  const compraValidada = validarCompra(datos);
  const compra = await registrarCompra(
    usuarioId,
    compraValidada.direccion,
    compraValidada.codigoPostal,
    compraValidada.items
  );

  return compra;
}

export async function listarComprasUsuario(usuarioId: number) {
  return await obtenerComprasPorUsuario(usuarioId);
}