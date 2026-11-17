// catalogo.ts (service)
import {  Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../../shared/models/categoria';
@Injectable({ providedIn: 'root' })
export class CatalogoService {

  private http = inject(HttpClient);

  private categoriaApiUrl = 'http://localhost:3000/api/categorias';

 
private readonly categoriasSignal = signal<Categoria[]>([]);
readonly categorias = this.categoriasSignal.asReadonly();



  cargarCategorias(): void {
    this.http.get<Categoria[]>(this.categoriaApiUrl).subscribe({
      next: (categorias) => {
        this.categoriasSignal.set(categorias);
      },
      error: (error) => {
        console.log("No se puedieron cargar las categorias", error);
      }
      });
    }


}
