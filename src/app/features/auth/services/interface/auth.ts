import { UsuarioAutenticado } from "../../../../shared/models/usuario";

export interface RespuestaAutenticacion {
    mensaje: string;
    usuario: UsuarioAutenticado
}