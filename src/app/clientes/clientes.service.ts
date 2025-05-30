import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iCliente } from './clientes.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes
  getClientes(): Observable<iCliente[]> {
    return this.http.get<iCliente[]>(this.apiUrl);
  }

  // Obtener un cliente por su ID
  getCliente(id: string): Observable<iCliente> {
    return this.http.get<iCliente>(`${this.apiUrl}/${id}`);
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

