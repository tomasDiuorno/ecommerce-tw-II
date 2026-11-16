import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Producto } from '../../../shared/models/producto';

@Service()
export class DestacadosService {

      private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/productos/destacados';

  readonly productosDestacadosSignal = signal<readonly Producto[]>([]);
  readonly productosDestacados = this.productosDestacadosSignal.asReadonly();

  cargarProductosDestacados(): void{
this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (productos) => {
        this.productosDestacadosSignal.set(productos);
      },
      error: (error) => {
        console.log("No se puedieron cargar los productos", error);
      }
      });
    }
  }

