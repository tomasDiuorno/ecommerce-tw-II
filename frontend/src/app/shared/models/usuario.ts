export interface Usuario {
    email: string;
    contrasenia: string;
    nombre: string;
    apellido: string;
    direccion: string;
}
export interface UsuarioAutenticado {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string;
  rol: 'user' | 'admin';
}