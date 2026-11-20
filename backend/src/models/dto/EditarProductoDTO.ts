export interface EditarProductoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    categoriaId: number;
    precio: number;
    imagen: string | null;
    disponible: boolean;
    destacado: boolean;
}