import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface DireccionSugerida {
  id: number;
  direccion: string;
  codigoPostal: string | null;
}

interface NominatimResultado {
  place_id: number;
  display_name: string;
  address?: { postcode?: string };
}

@Injectable({ providedIn: 'root' })
export class DireccionesService {
  private readonly http = inject(HttpClient);

  buscar(texto: string): Observable<DireccionSugerida[]> {
    const params = new HttpParams()
      .set('q', texto)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('countrycodes', 'ar');

    return this.http
      .get<NominatimResultado[]>('https://nominatim.openstreetmap.org/search', { params })
      .pipe(
        map(resultados =>
          resultados.map(item => ({
            id: item.place_id,
            direccion: item.display_name,
            codigoPostal: item.address?.postcode ?? null,
          })),
        ),
      );
  }
}
