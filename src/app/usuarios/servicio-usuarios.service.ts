import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Usuario {
  email: string;
  nombre: string;
  apellidouno: string;
  apellidodos: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class ServicioUsuariosService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  // * Buscar usuario por email
  getUsuarioByEmail(email: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
    );
  }

  // * Login
  login(email: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(usuarios => usuarios.length > 0 ? usuarios[0] : null)
    );
  }

  // * Registro
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}
