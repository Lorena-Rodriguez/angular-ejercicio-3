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
  private apiUrlCategorias = 'http://localhost:3000/categorias';
  private apiUrlUnidadesMedida = 'http://localhost:3000/unidadesMedida';

  constructor(private http: HttpClient) {}

  // Métodos para productos
  // Obtiene todos los productos
  getProductos(): Observable<iProducto[]> {
    return this.http.get<iProducto[]>(this.apiUrlProductos);
  }

  // Obtiene un producto por su ID
  getProducto(id: string): Observable<iProducto> {
    return this.http.get<iProducto>(`${this.apiUrlProductos}/${id}`);
  }

  // Métodos para añadir, actualizar y eliminar productos
  addProducto(producto: iProducto): Observable<iProducto> {
    return this.http.post<iProducto>(this.apiUrlProductos, producto);
  }

  updateProducto(id: string, producto: iProducto): Observable<iProducto> {
    return this.http.put<iProducto>(`${this.apiUrlProductos}/${id}`, producto);
  }

  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProductos}/${id}`);
  }

  // Métodos para categorías
  getCategorias(): Observable<iCategorias[]> {
    return this.http.get<iCategorias[]>(this.apiUrlCategorias);
  }

  // Obtiene una categoría por su ID
  getCategoria(id: string): Observable<iCategorias> {
    return this.http.get<iCategorias>(`${this.apiUrlCategorias}/${id}`);
  }

  // Métodos para unidades de medida
  getUnidadesMedida(): Observable<iUnidadesMedida[]> {
    return this.http.get<iUnidadesMedida[]>(this.apiUrlUnidadesMedida);
  }

  // Obtiene una unidad de medida por su ID
  getUnidadMedida(id: string): Observable<iUnidadesMedida> {
    return this.http.get<iUnidadesMedida>(`${this.apiUrlUnidadesMedida}/${id}`);
  }
}
