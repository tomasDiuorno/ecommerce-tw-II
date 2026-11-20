// catalogo.ts (service)
import {  Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../../shared/models/categoria';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogoService {

  private http = inject(HttpClient);

  private categoriaApiUrl = 'http://localhost:3000/api/categorias';

 
private readonly categoriasSignal = signal<Categoria[]>([]);
readonly categorias = this.categoriasSignal.asReadonly();

private readonly cargandoSignal = signal(false);
readonly cargando = this.cargandoSignal.asReadonly();

private readonly errorSignal = signal<string | null>(null);
readonly error = this.errorSignal.asReadonly();

  cargarCategorias(): void {
      if (this.cargandoSignal()) {
        return;
      }
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);
    this.categoriasSignal.set([]);

    this.http.get<Categoria[]>(this.categoriaApiUrl)
    .pipe( finalize(() => {this.cargandoSignal.set(false);}))
    .subscribe({next: (categorias) => {this.categoriasSignal.set(categorias);}
    ,error: () => {this.errorSignal.set('No se pudieron cargar las categorías. Recargá la página para reintentar.');
      }});
    }



}
