// catalogo.ts (service)
import { Injectable } from '@angular/core';
import { Producto } from '../../../shared/models/producto';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private products: Producto[] = [
    { id: 1, nombre: 'Mouse', precio: 8000, categoria: 'electronics', descripcion: 'Mouse inalámbrico', imagen: 'https://diamondsystemar.vtexassets.com/arquivos/ids/163744-1600-auto?v=638850831204430000&width=1600&height=auto&aspect=true', disponible: true },
    { id: 2, nombre: 'Teclado', precio: 12000, categoria: 'electronics', descripcion: 'Teclado mecánico', imagen: 'https://diamondsystemar.vtexassets.com/arquivos/ids/162444-1600-auto?v=638808487721170000&width=1600&height=auto&aspect=true', disponible: false },
    { id: 3, nombre: 'Telefono', precio: 500, categoria: 'food', descripcion: 'Manzana roja', imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_841265-MLA115895377340_092026-F.webp', disponible: true },
  ];

  getProductos(): Observable<Producto[]> {
    return of(this.products);
  }
}