import bcrypt from "bcryptjs";
import type { UsuarioDB } from "../models/usuarioModel.js";
import { DatosRegistro } from "../models/dto/UsuarioDTO.js";
import { buscarUsuarioPorEmail, buscarUsuarioPorId, crearUsuario, actualizarUsuario } from "../repositories/usuarioRepositorio.js";

export type UsuarioPublico = Omit<UsuarioDB, "contraseniaHash">;

export class UsuarioService {
  async registrar(datos: DatosRegistro): Promise<UsuarioPublico> {
    if (!this.contraseniaEsValida(datos.contrasenia)) {
      throw new Error("CONTRASENIA_INVALIDA");
    }
    
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

  async buscarPorId(id: number): Promise<UsuarioPublico | null>{
    const usuario = await buscarUsuarioPorId(id);
    if(!usuario){
      return null;
    }
    const {contraseniaHash: _, ...usuarioPublico} = usuario;
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

  async actualizarPerfil(
    id: number,
    datos: {
      email: string;
      nombre: string;
      apellido: string;
      direccion: string;
    }
  ) {
    return await actualizarUsuario(id, datos);
  }
  
}