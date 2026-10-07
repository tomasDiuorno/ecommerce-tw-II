import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface DireccionSugerida{
    id: number,
    direccion: string
}

@Injectable({ providedIn: 'root' })
export class DireccionesService {
    private http = inject(HttpClient)

    buscar(direccion: string): Observable<DireccionSugerida[]> {
    const url = `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json&addressdetails=1&countrycodes=ar`;

    return this.http.get<any[]>(url).pipe(
      // Transformamos la respuesta fea de la API a nuestro modelo limpio
      map(resultados => resultados.map(item => ({
        id: item.place_id,
        direccion: item.display_name
      })))
    );
  }
}
