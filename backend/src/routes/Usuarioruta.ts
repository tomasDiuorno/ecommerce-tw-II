import { Router } from "express";
import * as usuarioController from "../controllers/usuarioControlador.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/signup", usuarioController.registrarUsuario);
router.post("/signin", usuarioController.iniciarSesion);
router.get("/me", requireAuth, usuarioController.obtenerUsuarioActual);
router.put("/me", requireAuth, usuarioController.actualizarPerfil);
router.post("/logout", usuarioController.cerrarSesion);

export default router;