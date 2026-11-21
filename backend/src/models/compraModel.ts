export interface SolicitudCompra {
  direccion: string;
  codigoPostal: string;
  metodoPago: 'contraEntrega' | 'online';
  items: {
    productoId: number;
    cantidad: number;
  }[];
}

export interface DetalleCompraHistorial {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: string;
}

export interface CompraHistorial {
  id: number;
  fecha: Date | string;
  direccion: string;
  codigoPostal: string;
  subtotal: string;
  costoEnvio: string;
  total: string;
  estado: string;
  items: DetalleCompraHistorial[];
}
