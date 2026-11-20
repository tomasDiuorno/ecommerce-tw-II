import { Router } from "express";
import * as usuarioController from "../controllers/usuarioControlador.js";

const router = Router();

router.post("/signup", usuarioController.registrarUsuario);
router.post("/signin", usuarioController.iniciarSesion);
router.get("/me", usuarioController.obtenerUsuarioActual);
router.post("/logout", usuarioController.cerrarSesion);

export default router;