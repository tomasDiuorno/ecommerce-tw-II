import { Router } from 'express';

import { obtenerProductosDisponibles, obtenerProductosDestacados, obtenerProductoPorId, obtenerProductos} from '../controllers/productoControlador.js';

const router = Router();

router.get('/', obtenerProductosDisponibles);
router.get('/destacados', obtenerProductosDestacados);
router.get('/todosLosProductos', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

export default router;
