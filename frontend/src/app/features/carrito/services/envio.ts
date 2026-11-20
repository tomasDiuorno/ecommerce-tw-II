import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface SolicitudEnvio {direccion: string;codigoPostal: string;
  items: {productoId: number; cantidad: number;}[];
}

export interface CotizacionEnvio {
  subtotal: number;
  envio: number;
  total: number;
  zona: 'sanJusto' | 'amba' | 'restoDelPais';
}

@Injectable({ providedIn: 'root' })
export class EnvioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/envios/cotizar';

  cotizar(solicitud: SolicitudEnvio) {
    return this.http.post<CotizacionEnvio>(this.apiUrl, solicitud);
  }
}