import { leerUsuarios, guardarUsuarios, Usuario } from "../models/usuarioModel.js";

export class UsuarioService {
  obtenerTodos(): Usuario[] {
    return leerUsuarios();
  }

  registrar(datos: Omit<Usuario, "id">): void {
    const usuarios = leerUsuarios();

    const nuevoUsuario: Usuario = {
      id: usuarios.length + 1,
      ...datos
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
  }

  existeEmail(email: string): boolean {
    const usuarios = leerUsuarios();
    return usuarios.some(u => u.email === email);
  }

    buscarPorCredenciales(email: string, contrasenia: string): Usuario | undefined {
    const usuarios = leerUsuarios();
    return usuarios.find(u => u.email === email && u.contrasenia === contrasenia);
  }
}