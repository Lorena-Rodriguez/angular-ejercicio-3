import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iProducto } from './productos.interface';
import { iCategorias } from '../categorias/categorias.interface';
import { iUnidadesMedida } from '../unidadesMedida/unidadesMedida.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrlProductos = 'http://localhost:3000/productos';
  private apiUrlCategorias = 'http://localhost:3000/categorías';
  private apiUrlUnidadesMedida = 'http://localhost:3000/unidadesMedida';

  constructor(private http: HttpClient) {}

  // 🔹 Métodos para productos
  getProductos(): Observable<iProducto[]> {
    return this.http.get<iProducto[]>(this.apiUrlProductos);
  }

  getProducto(id: number): Observable<iProducto> {
    return this.http.get<iProducto>(`${this.apiUrlProductos}/${id}`);
  }

  addProducto(producto: iProducto): Observable<iProducto> {
    return this.http.post<iProducto>(this.apiUrlProductos, producto);
  }

  updateProducto(id: number, producto: iProducto): Observable<iProducto> {
    return this.http.put<iProducto>(`${this.apiUrlProductos}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProductos}/${id}`);
  }

  // 🔹 Métodos para categorías
  getCategorias(): Observable<iCategorias[]> {
    return this.http.get<iCategorias[]>(this.apiUrlCategorias);
  }

  getCategoria(id: string): Observable<iCategorias> {
    return this.http.get<iCategorias>(`${this.apiUrlCategorias}/${id}`);
  }

  // 🔹 Métodos para unidades de medida
  getUnidadesMedida(): Observable<iUnidadesMedida[]> {
    return this.http.get<iUnidadesMedida[]>(this.apiUrlUnidadesMedida);
  }

  getUnidadMedida(id: string): Observable<iUnidadesMedida> {
    return this.http.get<iUnidadesMedida>(`${this.apiUrlUnidadesMedida}/${id}`);
  }
}
