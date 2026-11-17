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

  /*Valida en todos los casos que si tiene un caracter de esos que pone ahi es obligatorio */
    contraseniaEsValida(contrasenia: string): boolean {
    const tieneLargo = contrasenia.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(contrasenia);
    const tieneMinuscula = /[a-z]/.test(contrasenia);
    const tieneNumero = /[0-9]/.test(contrasenia);
    const tieneSimbolo = /[^A-Za-z0-9]/.test(contrasenia);

    return tieneLargo && tieneMayuscula && tieneMinuscula && tieneNumero && tieneSimbolo;
  }

    buscarPorCredenciales(email: string, contrasenia: string): Usuario | undefined {
    const usuarios = leerUsuarios();
    return usuarios.find(u => u.email === email && u.contrasenia === contrasenia);
  }
}