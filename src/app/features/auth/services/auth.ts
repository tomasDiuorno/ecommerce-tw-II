import {inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models/usuario';

@Injectable({providedIn: 'root'})
export class AuthService{
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/usuarios';

    usuarioLogueado = signal <Omit<Usuario, 'contrasenia'> | null > (null);

    signup(usuario: Usuario): Observable <any>{
        return this.http.post(`${this.apiUrl}/signup`, usuario);
    }

    signin(email: string, contrasenia: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { email, contrasenia });
  }

  logout() {
    this.usuarioLogueado.set(null);
  }
}