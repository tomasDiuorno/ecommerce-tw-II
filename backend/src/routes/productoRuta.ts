import { Router } from 'express';

import { obtenerProductos, obtenerProductosDestacados } from '../controllers/productoControlador.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/destacados', obtenerProductosDestacados);

export default router;
