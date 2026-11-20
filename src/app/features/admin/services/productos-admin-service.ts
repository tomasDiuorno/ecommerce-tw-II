import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, CrearProducto } from '../../../shared/models/producto';
import { HttpClient } from '@angular/common/http';

@Service()
export class ProductosAdminService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/productos';

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  agregarStock(id: number, stock: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/agregarStock/${id}`, { stock });
  }

  quitarStock(id: number, stock: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/quitarStock/${id}`, { stock });
  }

  cargarTodosLosProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/todosLosProductos`,);
  }

  crearProducto(datos: CrearProducto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, datos);
  }
}
