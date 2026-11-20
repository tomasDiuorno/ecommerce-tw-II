export interface UsuarioDB {
    id: number;
    email: string;
    contraseniaHash: string;
    nombre: string;
    apellido: string;
    direccion: string;
}
export interface Usuario{
    id: number;
    email: string;
    contrasenia: string;
    nombre: string;
    apellido: string;
    direccion: string;
}