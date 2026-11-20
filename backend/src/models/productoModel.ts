export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    categoriaId: number;
    precio: number;
    imagen: string | null;
    stock: number;
    disponible: boolean;
    destacado: boolean;
}

export interface CrearProducto {
  nombre: string;
  descripcion: string;
  categoriaId: number;
  precio: number;
  imagen: string | null;
  stock: number;
  disponible: boolean;
  destacado: boolean;
}
