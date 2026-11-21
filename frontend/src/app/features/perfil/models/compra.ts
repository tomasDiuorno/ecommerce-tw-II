export interface DetalleCompra {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: string;
}

export interface CompraHistorial {
  id: number;
  fecha: string;
  direccion: string;
  codigoPostal: string;
  subtotal: string;
  costoEnvio: string;
  total: string;
  estado: string;
  items: DetalleCompra[];
}

export interface RespuestaMisCompras {
  compras: CompraHistorial[];
}