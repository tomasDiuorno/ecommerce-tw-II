import { HttpError } from "../middlewares/HttpError.js";
import { Producto } from "../models/productoModel.js";
import { listarProductos, listarProductosDestacados, agregarStock, quitarStock } from "../repositories/productoRepositorio.js";

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

export async function agregarStockProducto(id:number, stock:number): Promise<void>{
    if(!Number.isSafeInteger(id) || stock <= 0){
        throw new HttpError(400, "El stock a agregar debe ser mayor a 0")
    }

    await agregarStock(id, stock);
}


export async function quitarStockProducto(id:number, stock:number): Promise<void>{
    if(!Number.isSafeInteger(id) || stock <= 0){
        throw new HttpError(400, "El stock a quitar debe ser mayor a 0")
    }

    await quitarStock(id, stock);
}