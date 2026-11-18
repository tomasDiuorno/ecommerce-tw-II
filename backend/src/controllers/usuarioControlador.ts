import { Request, Response } from "express";
import { UsuarioService } from "../services/usuarioService.js";
import { validarLogin, validarRegistro } from "../validators/usuarioValidator.js";

const usuarioService = new UsuarioService();

export async function registrarUsuario(req: Request, res: Response) {
  const datosRegistro = validarRegistro(req.body);

  if (!datosRegistro) {
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios o tienen un formato inválido"
    });
  }

  try {
    const usuario = await usuarioService.registrar(datosRegistro);

    return res.status(201).json({
      mensaje: "Usuario registrado",
      usuario
    });

  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return res.status(409).json({
        mensaje: "El email ya está registrado"
      });
    }

    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      mensaje: "Error interno al registrar el usuario"
    });
  }
}

export async function iniciarSesion(req: Request, res: Response) {
  const datosLogin = validarLogin(req.body);

  if (!datosLogin) {
    return res.status(400).json({
      mensaje: "Email y contraseña son obligatorios"
    });
  }

  try {
    const usuario = await usuarioService.buscarPorCredenciales(datosLogin.email, datosLogin.contrasenia);

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos"
      });
    }

    return res.json(usuario);

  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión"
    });
  }
}