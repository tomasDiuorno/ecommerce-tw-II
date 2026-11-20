import { Router } from 'express';

import { 
    obtenerProductosDisponibles, 
    obtenerProductosDestacados, 
    obtenerProductoPorId, 
    obtenerProductos, 
    agregarStock, 
    quitarStock, 
    crearProducto,
    eliminarProducto
} from '../controllers/productoControlador.js';

const router = Router();

router.post('/', crearProducto);
router.delete('/:id', eliminarProducto);
router.get('/', obtenerProductosDisponibles);
router.get('/destacados', obtenerProductosDestacados);
router.get('/todosLosProductos', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/agregarStock/:id', agregarStock);
router.post('/quitarStock/:id', quitarStock);


export default router;
