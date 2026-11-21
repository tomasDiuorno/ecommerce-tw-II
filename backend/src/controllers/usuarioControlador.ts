import { Request, Response } from "express";
import { UsuarioService } from "../services/usuarioService.js";
import { validarActualizacionPerfil, validarLogin, validarRegistro } from "../validators/usuarioValidator.js";

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

export async function obtenerUsuarioActual(req: Request, res: Response) {
  const usuarioId = req.session.usuarioId;
  if (!usuarioId) {
    return res.status(401).json({
      mensaje: "No hay una sesion activa"
    });
  }
  try {
    const usuario = await usuarioService.buscarPorId(usuarioId)
    if (!usuario) {
      return res.status(401).json({
        mensaje: "El usuario de la sesion ya no existe"
      });
    }
    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario actual: ", error);
    return res.status(500).json({
      mensaje: "Error interno al obtener el usuario"
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

    req.session.regenerate((error) => {
      if (error) {
        console.error("Error al generar la sesion", error);
        return res.status(500).json({
          mensaje: "No se pudo iniciar la sesion"
        });
      }

      req.session.usuarioId = usuario.id;

      req.session.save((error) => {
        if (error) {
          console.error("Error al guardar la sesion: ", error);
          return res.status(500).json({
            mensaje: "No se pudo guardar la sesion"
          });
        }

        return res.status(200).json({
          mensaje: "Inicio de sesion exitoso",
          usuario
        });
      });
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión"
    });
  }
}

export async function cerrarSesion(req: Request, res: Response) {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al cerrar la sesion: ", error);
      return res.status(500).json({
        mensaje: "No se pudo cerrar sesion"
      });
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/"
    });

    return res.status(200).json({
      mensaje: "Sesion cerrada correctamente"
    });
  });
}


export async function actualizarPerfil(req: Request, res: Response) {
  const usuarioId = req.session.usuarioId;

  if (!usuarioId) {
    return res.status(401).json({
      mensaje: "Debés iniciar sesión"
    });
  }

  const datos = validarActualizacionPerfil(req.body);

  if (!datos) {
    return res.status(400).json({
      mensaje: "Los datos del perfil no son válidos"
    });
  }

  try {
    const usuario = await usuarioService.actualizarPerfil(usuarioId, datos);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "No se encontró el usuario"
      });
    }

    return res.status(200).json({
      mensaje: "Perfil actualizado correctamente",
      usuario
    });

  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return res.status(409).json({
        mensaje: "El email ya está registrado por otro usuario"
      });
    }

    console.error("Error al actualizar el perfil:", error);

    return res.status(500).json({
      mensaje: "Error interno al actualizar el perfil"
    });
  }
}
