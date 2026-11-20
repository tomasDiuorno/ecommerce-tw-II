
import { pool } from '../config/database.js';
import { HttpError } from '../middlewares/HttpError.js';
import {
  calcularCostoEnvio,
  determinarZona
} from '../services/envioService.js';

interface ItemCompra {
  productoId: number;
  cantidad: number;
}

export async function registrarCompra(
  usuarioId: number,
  direccion: string,
  codigoPostal: string,
  items: ItemCompra[]
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let subtotalCentavos = 0;

    const productosComprados: {
      id: number;
      nombre: string;
      precio: number;
      cantidad: number;
    }[] = [];

    for (const item of [...items].sort(
      (a, b) => a.productoId - b.productoId
    )) {
      const resultado = await client.query(
        `SELECT id, nombre, precio, stock, disponible
         FROM productos
         WHERE id = $1
         FOR UPDATE`,
        [item.productoId]
      );

      const producto = resultado.rows[0];

      if (!producto) {
        throw new HttpError(
          400,
          `El producto ${item.productoId} no existe`
        );
      }

      if (!producto.disponible || producto.stock < item.cantidad) {
        throw new HttpError(
          400,
          `Stock insuficiente para ${producto.nombre}`
        );
      }

      const precioCentavos = Math.round(
        Number(producto.precio) * 100
      );

      subtotalCentavos += precioCentavos * item.cantidad;

      if (!Number.isSafeInteger(subtotalCentavos)) {
        throw new HttpError(
          400,
          'El importe de la compra es demasiado grande'
        );
      }

      productosComprados.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: precioCentavos / 100,
        cantidad: item.cantidad
      });
    }

    const subtotal = subtotalCentavos / 100;
    const zona = determinarZona(codigoPostal);
    const costoEnvio = calcularCostoEnvio(subtotal, zona);
    const total = (subtotalCentavos + costoEnvio * 100) / 100;

    const resultadoCompra = await client.query(
      `INSERT INTO compras
       (usuario_id, direccion, codigo_postal,
        subtotal, costo_envio, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        usuarioId,
        direccion,
        codigoPostal,
        subtotal,
        costoEnvio,
        total
      ]
    );

    const compra = resultadoCompra.rows[0];

    for (const producto of productosComprados) {
      await client.query(
        `INSERT INTO detalle_compras
         (compra_id, producto_id, nombre_producto,
          cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          compra.id,
          producto.id,
          producto.nombre,
          producto.cantidad,
          producto.precio
        ]
      );

      await client.query(
        `UPDATE productos
         SET stock = stock - $1
         WHERE id = $2`,
        [producto.cantidad, producto.id]
      );
    }


    await client.query('COMMIT');

    return compra;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;

  } finally {
    client.release();
  }
}
