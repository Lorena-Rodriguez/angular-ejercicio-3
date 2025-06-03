import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iCliente } from './clientes.interface';

@Injectable({
  providedIn: 'root' // Proporciona el servicio a nivel de toda la aplicación
})
export class ClientesService {
  private apiUrl = 'http://localhost:3000/clientes'; // URL de la API para gestionar clientes

  constructor(private http: HttpClient) {} // Inyecta el HttpClient para realizar peticiones HTTP

  // Obtener todos los clientes
  getClientes(): Observable<iCliente[]> {
    return this.http.get<iCliente[]>(this.apiUrl);
  }

  // Obtener un cliente por su ID
getCliente(idCliente: string): Observable<iCliente[]> { 
  return this.http.get<iCliente[]>(`${this.apiUrl}?idCliente=${idCliente}`); // Filtra por idCliente
}

  // Agregar un nuevo cliente
  addCliente(cliente: iCliente): Observable<iCliente> {
    return this.http.post<iCliente>(this.apiUrl, cliente);
  }

  // Actualizar un cliente existente
  updateCliente(id: string, cliente: iCliente): Observable<iCliente> {
    return this.http.put<iCliente>(`${this.apiUrl}/${id}`, cliente);
  }

  // Eliminar un cliente por su ID
  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

