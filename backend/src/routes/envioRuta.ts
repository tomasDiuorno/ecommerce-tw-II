import { Router } from 'express';
import { obtenerCotizacionEnvio } from '../controllers/envioControlador.js';

const router = Router();

router.post('/cotizar', obtenerCotizacionEnvio);

export default router;