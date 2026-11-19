export type ResultadoQuitarStock =
  | { estado: 'actualizado'; stock: number }
  | { estado: 'no-encontrado' }
  | { estado: 'stock-insuficiente' };