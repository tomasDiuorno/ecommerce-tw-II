import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/productos';

  cargarProductos(categoriaId?: number, busqueda?: string): Observable<Producto[]> {
    let params = new HttpParams();

    if (categoriaId !== undefined) {
      params = params.set('categoria', categoriaId);
    }

    if (busqueda !== undefined) {
      params = params.set('busqueda', busqueda);
    }
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }

 

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(
    `${this.apiUrl}/${id}`);
  }
}
