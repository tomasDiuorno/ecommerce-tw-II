import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, CrearProducto } from '../../../shared/models/producto';
import { HttpClient } from '@angular/common/http';
import type { EditarProductoDTO } from '../models/EditarProductoDTO';

@Service()
export class ProductosAdminService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/productos';

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, { withCredentials: true },);
  }

  editarProducto(datos: EditarProductoDTO): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/editarProducto`, datos,{ withCredentials: true },);
  }

  agregarStock(id: number, stock: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/agregarStock/${id}`, { stock }, { withCredentials: true },);
  }

  quitarStock(id: number, stock: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/quitarStock/${id}`, { stock }, { withCredentials: true },);
  }

  cargarTodosLosProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/todosLosProductos`,{ withCredentials: true },);
  }

  crearProducto(datos: CrearProducto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, datos, { withCredentials: true },);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true },);
  }

}
