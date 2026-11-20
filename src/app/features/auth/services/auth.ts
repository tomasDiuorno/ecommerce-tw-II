
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

import { Usuario, UsuarioAutenticado } from '../../../shared/models/usuario';
import { RespuestaAutenticacion } from './interface/auth';

// Datos que se pueden modificar desde el perfil
export type DatosPerfil = Omit<UsuarioAutenticado, 'id'>;

// Usuario sin contraseña
type UsuarioLogueado = UsuarioAutenticado;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/usuarios';

  // Usuario actualmente autenticado
  usuarioLogueado = signal<UsuarioLogueado | null>(
    this.cargarSesion()
  );

  // Indica si ya se comprobó la sesión
  sesionCargada = signal<boolean>(false);

  // Recuperar usuario guardado en localStorage
  private cargarSesion(): UsuarioLogueado | null {
    try {
      const guardado = localStorage.getItem('usuarioLogueado');
      return guardado ? JSON.parse(guardado) : null;
    } 
    catch {
      return null;
    }
  }

  // Guardar usuario en localStorage
  private guardarSesion(usuario: UsuarioLogueado): void {
    localStorage.setItem(
      'usuarioLogueado',
      JSON.stringify(usuario)
    );
  }

  // Limpiar sesión local
  private limpiarSesion(): void {
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueado.set(null);
  }

  // Registrar usuario
  signup(usuario: Usuario): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/signup`,
      usuario,
      { withCredentials: true }
    );
  }

  // Iniciar sesión
  signin(
    email: string,
    contrasenia: string
  ): Observable<RespuestaAutenticacion> {

    return this.http.post<RespuestaAutenticacion>(
      `${this.apiUrl}/signin`,
      { email, contrasenia },
      { withCredentials: true }
    ).pipe(
      tap(respuesta => {
        this.usuarioLogueado.set(respuesta.usuario);
        this.guardarSesion(respuesta.usuario);
        this.sesionCargada.set(true);
      })
    );
  }

  // Recuperar sesión al actualizar la página
  cargarUsuarioActual(): Observable<UsuarioAutenticado | null> {

    return this.http.get<UsuarioAutenticado>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    ).pipe(
      tap(usuario => {
        this.usuarioLogueado.set(usuario);
        this.guardarSesion(usuario);
      }),

      catchError(() => {
        this.limpiarSesion();
        return of(null);
      }),

      tap(() => {
        this.sesionCargada.set(true);
      })
    );
  }

  // Actualizar perfil
  actualizarPerfil(datos: DatosPerfil): Observable<{
    mensaje: string;
    usuario: UsuarioAutenticado;
  }> {

    return this.http.put<{
      mensaje: string; 
      usuario: UsuarioAutenticado; 
    }>(
      `${this.apiUrl}/me`,
      datos,
      { withCredentials: true }

    ).pipe(

      tap(respuesta => {
        this.usuarioLogueado.set(respuesta.usuario);
        this.guardarSesion(respuesta.usuario);
      })
      
    );
  }

  // Verificar si hay un usuario autenticado
  estaLogueado(): boolean {
    return this.usuarioLogueado() !== null;
  }

  // Cerrar sesión
  logout(): Observable<{ mensaje: string }> {

    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(

      tap(() => {
        this.limpiarSesion();
        this.sesionCargada.set(true);
      })

    );
  }
}
