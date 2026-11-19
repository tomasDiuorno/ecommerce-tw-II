import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, CrearProducto } from '../../../shared/models/producto';
import { HttpClient } from '@angular/common/http';

@Service()
export class ProductosAdminService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/productos';

     cargarTodosLosProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(
          `${this.apiUrl}/todosLosProductos`,
        );
      }

      crearProducto(datos: CrearProducto): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, datos);
      }
}
