import { Request, Response } from "express";
import { UsuarioService } from "../services/usuarioService.js";

const usuarioService = new UsuarioService();

export async function registrarUsuario(req: Request, res: Response) {
  const { email, contrasenia, nombre, apellido, direccion } = req.body ?? {};

  if (typeof email !== "string" || typeof contrasenia !== "string" ||
    typeof nombre !== "string" || typeof apellido !== "string" ||
    typeof direccion !== "string" || !email.trim() || !contrasenia ||
    !nombre.trim() || !apellido.trim() || !direccion.trim()
  ) {
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios o tienen un formato inválido"
    });
  }

  if (!usuarioService.contraseniaEsValida(contrasenia)) {
    return res.status(400).json({
      mensaje: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo"
    });
  }

  const emailNormalizado = email.trim().toLowerCase();

  try {
    const usuario = await usuarioService.registrar({
      email: emailNormalizado,
      contrasenia,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      direccion: direccion.trim()
    });

    return res.status(201).json({
      mensaje: "Usuario registrado",
      usuario
    });

  } catch (error) {
    if ( typeof error === "object" && error !== null && "code" in error && error.code === "23505" )
    {
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
  const { email, contrasenia } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof contrasenia !== "string" ||
    !email.trim() ||
    !contrasenia
  ) {
    return res.status(400).json({
      mensaje: "Email y contraseña son obligatorios"
    });
  }

  try {
    const emailNormalizado = email.trim().toLowerCase();

    const usuario = await usuarioService.buscarPorCredenciales(
      emailNormalizado,
      contrasenia
    );

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