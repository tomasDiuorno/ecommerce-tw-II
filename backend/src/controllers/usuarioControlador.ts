import { Request, Response } from "express";
import { UsuarioService } from "../services/usuarioService.js";

const usuarioService = new UsuarioService();

export function obtenerUsuarios(req: Request, res: Response) {
  const usuarios = usuarioService.obtenerTodos();
  res.json(usuarios);
}

export function registrarUsuario(req: Request, res: Response) {
  const { email, contrasenia, nombre, apellido } = req.body;

  const emailNormalizado = email.trim().toLowerCase();

  if (usuarioService.existeEmail(emailNormalizado)) {
    return res.status(409).json({ mensaje: "El email ya está registrado" });
  }

  usuarioService.registrar({ email: emailNormalizado, contrasenia, nombre, apellido });

  res.status(201).json({ mensaje: "Usuario registrado" });
}

export function iniciarSesion(req: Request, res: Response) {
  const { email, contrasenia } = req.body;

  const emailNormalizado = email.trim().toLowerCase();

  const usuario = usuarioService.buscarPorCredenciales(emailNormalizado, contrasenia);

  if (!usuario) {
    return res.status(401).json({ mensaje: "Email o contraseña incorrectos" });
  }

  res.json({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    direccion: usuario
  });
}