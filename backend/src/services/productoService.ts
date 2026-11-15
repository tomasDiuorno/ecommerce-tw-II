import { HttpError } from "../middlewares/HttpError.js";
import { Producto } from "../models/productoModel.js";
import { listarProductos, listarProductosDestacados } from "../repositories/productoRepositorio.js";

export function obtenerTodosLosProductos(categoria?: unknown): Promise<Producto[]> {
    if (categoria === undefined) {
        return listarProductos(null);
    }

    if (typeof categoria !== "string" || !/^\d+$/.test(categoria)) {
        throw new HttpError(400, "La categoría debe ser un número entero");
    }

    return listarProductos(Number(categoria));
}

export function obtenerDestacados(): Promise<Producto[]> {
    return listarProductosDestacados();
}