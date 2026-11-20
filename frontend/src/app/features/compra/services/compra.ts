
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudCompra {
  direccion: string;
  codigoPostal: string;
  metodoPago: 'contraEntrega' | 'online';
  items: {
    productoId: number;
    cantidad: number;
  }[];
}

export interface CompraRealizada {
  id: number;
  usuario_id: number;
  fecha: string;
  direccion: string;
  codigo_postal: string;
  subtotal: string;
  costo_envio: string;
  total: string;
  estado: string;
}

interface RespuestaCompra {
  mensaje: string;
  compra: CompraRealizada;
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/compras';

  realizarCompra(datos: SolicitudCompra): Observable<RespuestaCompra> {
    return this.http.post<RespuestaCompra>(
      this.apiUrl,
      datos,
      { withCredentials: true }
    );
  }
}
