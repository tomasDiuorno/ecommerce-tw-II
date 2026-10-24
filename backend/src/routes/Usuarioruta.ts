import { Router } from "express";
import * as usuarioController from "../controllers/usuarioControlador.js";

const router = Router();

router.get("/", usuarioController.obtenerUsuarios);
router.post("/signup", usuarioController.registrarUsuario);
router.post("/signin", usuarioController.iniciarSesion);

export default router;