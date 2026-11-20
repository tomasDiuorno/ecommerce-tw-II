export interface SolicitudCompra {
  direccion: string;
  codigoPostal: string;
  metodoPago: 'contraEntrega' | 'online';
  items: {
    productoId: number;
    cantidad: number;
  }[];
}