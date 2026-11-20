export interface EditarProductoFormulario {
  nombre: string;
  descripcion: string;
  categoriaId: string;
  precio: number | null;
  imagen: string;
  disponible: boolean;
  destacado: boolean;
}