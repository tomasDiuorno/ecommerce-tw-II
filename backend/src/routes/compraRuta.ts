import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { confirmarCompra } from '../controllers/compraControlador.js'; 

const router = Router();

router.post('/', requireAuth, confirmarCompra);

export default router; 