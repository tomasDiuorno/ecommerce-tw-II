import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DatosPerfil,RespuestaActualizarPerfil} from '../models/perfil';
import { RespuestaMisCompras } from '../models/compra';

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private readonly http = inject(HttpClient);
    private readonly apiUsuarios = 'http://localhost:3000/api/usuarios';
    private readonly apiCompras = 'http://localhost:3000/api/compras';

    actualizarPerfil(
        datos: DatosPerfil
    ): Observable<RespuestaActualizarPerfil> {
        return this.http.put<RespuestaActualizarPerfil>(
            `${this.apiUsuarios}/me`,
            datos,
            { withCredentials: true }
        );
    }

    obtenerMisCompras(): Observable<RespuestaMisCompras> {
        return this.http.get<RespuestaMisCompras>(
            `${this.apiCompras}/mis-compras`,
            { withCredentials: true }
        );
    }
}