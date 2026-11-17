export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    imagen: string | null;
    stock: number;
    disponible: boolean;
    destacado: boolean;
}
