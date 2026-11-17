import bcrypt from "bcryptjs";
import type { UsuarioDB } from "../models/usuarioModel.js";
import { DatosRegistro } from "../models/dto/RegistroDTO.js";
import { buscarUsuarioPorEmail, crearUsuario } from "../repositories/usuarioRepositorio.js";

export type UsuarioPublico = Omit<UsuarioDB, "contraseniaHash">;

export class UsuarioService {
  async registrar(datos: DatosRegistro): Promise<UsuarioPublico> {
    const contraseniaHash = await bcrypt.hash(datos.contrasenia, 10);
    const nuevoUsuario = await crearUsuario({
      email: datos.email,
      contraseniaHash,
      nombre: datos.nombre,
      apellido: datos.apellido,
      direccion: datos.direccion
    });

    const { contraseniaHash: _, ...usuarioPublico } = nuevoUsuario;

    return usuarioPublico;
  }

  contraseniaEsValida(contrasenia: string): boolean {
    const tieneLargo = contrasenia.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(contrasenia);
    const tieneMinuscula = /[a-z]/.test(contrasenia);
    const tieneNumero = /[0-9]/.test(contrasenia);
    const tieneSimbolo = /[^A-Za-z0-9]/.test(contrasenia);

    return tieneLargo &&
      tieneMayuscula &&
      tieneMinuscula &&
      tieneNumero &&
      tieneSimbolo;
  }

  async buscarPorCredenciales(
    email: string,
    contrasenia: string
  ): Promise<UsuarioPublico | null> {

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
      return null;
    }

    const contraseniaCorrecta = await bcrypt.compare(
      contrasenia,
      usuario.contraseniaHash
    );

    if (!contraseniaCorrecta) {
      return null;
    }

    const { contraseniaHash: _, ...usuarioPublico } = usuario;

    return usuarioPublico;
  }
}