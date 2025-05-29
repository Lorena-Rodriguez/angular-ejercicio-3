import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iPoblaciones } from '../poblacion/poblacion.interface';

@Injectable({
  providedIn: 'root'
})
export class PoblacionService {
  private apiUrl = 'http://localhost:3000/poblaciones';

  constructor(private http: HttpClient) {}

  // Obtener todas las poblaciones
  getPoblaciones(): Observable<iPoblaciones[]> {
    return this.http.get<iPoblaciones[]>(this.apiUrl);
  }

  // Obtener una población por su ID
  getPoblacion(id: string): Observable<iPoblaciones> {
    return this.http.get<iPoblaciones>(`${this.apiUrl}/${id}`);
  }
}

