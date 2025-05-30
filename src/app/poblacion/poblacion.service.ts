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

  // Obtener todas las poblaciones por Código Postal
getPoblacionesPorCodigoPostal(codigoPostal: string): Observable<iPoblaciones[]> {
  return this.http.get<iPoblaciones[]>(`${this.apiUrl}?codigoPostal=${encodeURIComponent(codigoPostal)}`); // 🔹 Codifica el string para evitar problemas
}




  // Obtener una población por su ID
  getPoblacion(id: string): Observable<iPoblaciones> {
    return this.http.get<iPoblaciones>(`${this.apiUrl}/${id}`);
  }
  getProvinciaPorCodigoPostal(codigoPostal: string): Observable<iPoblaciones[]> {
  return this.http.get<iPoblaciones[]>(`${this.apiUrl}?codigoPostal=${codigoPostal}`); // Filtra por código postal
}

}

