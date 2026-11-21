import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { confirmarCompra, obtenerMisCompras } from '../controllers/compraControlador.js'; 

const router = Router();

router.post('/', requireAuth, confirmarCompra);
router.get('/mis-compras', requireAuth, obtenerMisCompras);

export default router; 