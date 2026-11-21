export interface DatosPerfil {
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
}

export interface RespuestaActualizarPerfil {
  mensaje: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    rol: 'user' | 'admin';
  };
}