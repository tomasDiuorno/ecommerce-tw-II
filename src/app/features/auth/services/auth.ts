import {inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models/usuario';

type UsuarioLogueado = Omit<Usuario, 'contrasenia'>;

@Injectable({providedIn: 'root'})
export class AuthService{
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/usuarios';

    usuarioLogueado = signal signal<UsuarioLogueado | null>(this.cargarSesion());

    private cargarSesion(): usuarioLogueado | null{
      try {
        const usuario = localStorage.getItem('usuarioLogueado');
        return usuario ? JSON.parse(usuario) : null;
      } 
      catch {
        return null;
      }
    }

    signup(usuario: Usuario): Observable <any>{
        return this.http.post(`${this.apiUrl}/signup`, usuario);
    }

    signin(email: string, contrasenia: string): Observable<any> {
    return this.http.post<UsuarioLogueado>(
      `${this.apiUrl}/signin`, 
      { email, contrasenia }
      ).pipe( tap(usuario => {
          this.usuarioLogueado.set(usuario);
          localStorage.setItem(
            'usuarioLogueado',
            JSON.stringify(usuario)
          );
        })
      );
  }

  estaLogueado(): boolean {
    return this.usuarioLogueado() !== null;
  }

  logout(): void {
    this.usuarioLogueado.set(null);
    localStorage.removeItem('usuarioLogueado');
  }
}