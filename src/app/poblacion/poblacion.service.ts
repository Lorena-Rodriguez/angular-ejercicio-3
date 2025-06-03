import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iPoblaciones } from '../poblacion/poblacion.interface';


@Injectable({
  providedIn: 'root' // Proporciona el servicio a nivel de toda la aplicación
})
export class PoblacionService {
  private apiUrl = 'http://localhost:3000/poblaciones'; // URL de la API para obtener poblaciones

  constructor(private http: HttpClient) {} // Inyecta el servicio HttpClient para realizar peticiones HTTP

  // Obtener todas las poblaciones por Código Postal
getPoblacionesPorCodigoPostal(codigoPostal: string): Observable<iPoblaciones[]> {
  return this.http.get<iPoblaciones[]>(`${this.apiUrl}?codigoPostal=${encodeURIComponent(codigoPostal)}`); // 🔹 Codifica el string para evitar problemas
}

  // Obtener una población por su ID
  getPoblacion(id: string): Observable<iPoblaciones> {
    return this.http.get<iPoblaciones>(`${this.apiUrl}/${id}`);
  }
  // Obtener todas las poblaciones
  getProvinciaPorCodigoPostal(codigoPostal: string): Observable<iPoblaciones[]> {
  return this.http.get<iPoblaciones[]>(`${this.apiUrl}?codigoPostal=${codigoPostal}`); // Filtra por código postal
}
}

