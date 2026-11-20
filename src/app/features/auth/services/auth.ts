import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Usuario, UsuarioAutenticado } from '../../../shared/models/usuario';
import { RespuestaAutenticacion } from "./interface/auth"

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/usuarios';

  usuarioLogueado = signal<UsuarioAutenticado | null>(null);
  sesionCargada = signal(false);

  signup(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, usuario);
  }

  signin(email: string, contrasenia: string): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(
      `${this.apiUrl}/signin`,
      { email, contrasenia },
      { withCredentials: true }
    ).pipe(
      tap(respuesta => {
        this.usuarioLogueado.set(respuesta.usuario);
        this.sesionCargada.set(true);
      })
    );
  }

  cargarUsuarioActual(): Observable<UsuarioAutenticado | null> {
    return this.http.get<UsuarioAutenticado>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    ).pipe(
      tap(usuario => {
        this.usuarioLogueado.set(usuario);
      }),
      catchError(() => {
        this.usuarioLogueado.set(null);
        return of(null);
      }),
      tap(() => {
        this.sesionCargada.set(true);
      })
    );
  }

  logout(): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.usuarioLogueado.set(null);
        this.sesionCargada.set(true);
      })
    );
  }
}