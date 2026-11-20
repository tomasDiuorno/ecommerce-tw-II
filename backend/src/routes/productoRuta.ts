import { Router } from 'express';

import { obtenerProductosDisponibles, obtenerProductosDestacados, obtenerProductoPorId, obtenerProductos, agregarStock, quitarStock, crearProducto} from '../controllers/productoControlador.js';

const router = Router();

router.post('/', crearProducto);
router.get('/', obtenerProductosDisponibles);
router.get('/destacados', obtenerProductosDestacados);
router.get('/todosLosProductos', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/agregarStock/:id', agregarStock);
router.post('/quitarStock/:id', quitarStock);


export default router;
