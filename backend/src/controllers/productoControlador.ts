import { Request, Response } from 'express';
import { productos } from '../models/productoModel.js';

export const obtenerProductos = (req: Request, res: Response) => {
    res.json(productos);
};

export const obtenerProductosDestacados = (req: Request, res: Response) => {

    const destacados = productos.filter( producto => producto.destacado );

    res.json(destacados);
};
