import { NextFunction, Request, Response } from 'express';
import { obtenerTodasLasCategorias } from '../services/categoriaService.js';

export async function obtenerCategorias(req: Request, res: Response, next: NextFunction){
    try{
    const categorias = await obtenerTodasLasCategorias();
    res.json(categorias);
    } catch(error){
        next(error);
    }
}