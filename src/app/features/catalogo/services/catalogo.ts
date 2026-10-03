// catalogo.ts (service)
import { Injectable } from '@angular/core';
import { Productos } from '../../../models/productos';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private products: Productos[] = [
    { id: 1, nombre: 'Mouse', precio: 8000, clasificacion: 'electronics', descripcion: 'Mouse inalámbrico', disponible: true },
    { id: 2, nombre: 'Teclado', precio: 12000, clasificacion: 'electronics', descripcion: 'Teclado mecánico', disponible: false },
    { id: 3, nombre: 'Telefono', precio: 500, clasificacion: 'food', descripcion: 'Manzana roja', disponible: true },
  ];

  getProductos(): Observable<Productos[]> {
    return of(this.products);
  }
}