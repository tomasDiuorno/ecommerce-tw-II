import { Router } from 'express';

import {
  obtenerProductosDisponibles,
  obtenerProductosDestacados,
  obtenerProductoPorId,
  obtenerProductos,
  agregarStock,
  quitarStock,
  crearProducto,
  editarProducto,
  eliminarProducto,
} from '../controllers/productoControlador.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = Router();

router.post('/', requireAdmin,crearProducto);
router.delete('/:id',requireAdmin, eliminarProducto);
router.get('/', obtenerProductosDisponibles);
router.get('/destacados', obtenerProductosDestacados);
router.get('/todosLosProductos', requireAdmin,obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/agregarStock/:id', requireAdmin,agregarStock);
router.post('/quitarStock/:id', requireAdmin,quitarStock);
router.put('/editarProducto', requireAdmin,editarProducto);


export default router;
