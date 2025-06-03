import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../productos/productos.service';
import { iProducto } from '../productos/productos.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listado-productos',
  standalone: false,
  templateUrl: './listado-productos.component.html',
  styleUrl: './listado-productos.component.css'
})
export class ListadoProductosComponent implements OnInit { // Componente para listar productos
  // Se define el tipo de datos para los productos
  productos: iProducto[] = [];
  unidadesMedidaDisponibles: { idUnidad: string; descripcion: string }[] = [];
  categoriasDisponibles: { idCategoria: string; descripcion: string }[] = [];

  // Se inyectan los servicios necesarios
  constructor(private productosService: ProductosService, private router: Router) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    forkJoin({ // Utiliza forkJoin para realizar múltiples peticiones simultáneamente
      productos: this.productosService.getProductos(), // Obtiene la lista de productos
      unidades: this.productosService.getUnidadesMedida(), // Obtiene las unidades de medida disponibles
      categorias: this.productosService.getCategorias() // Obtiene las categorías disponibles
    }).subscribe(({ productos, unidades, categorias }) => { // Desestructura la respuesta para obtener productos, unidades y categorías
      // Asigna los datos obtenidos a las propiedades del componente
      this.productos = productos;
      this.unidadesMedidaDisponibles = unidades.map(u => ({ idUnidad: u.idUnidad, descripcion: u.descripcion }));
      this.categoriasDisponibles = categorias.map(c => ({ idCategoria: c.idCategoria, descripcion: c.descripcion }));
    });
  }

  // Método para editar un producto
  editarProducto(producto: iProducto): void {
    this.router.navigate(['/datos-producto', producto.id]);
  }

  // Método para crear un producto
  btncrearProducto(): void {
    this.router.navigate(['/datos-producto']);
  }

  // Método para volver a la página principal
  volverPaginaPrincipal(): void {
    this.router.navigate(['/']);
  }

  // Métodos para obtener descripciones de unidades y categorías
  getDescripcionUnidad(idUnidad: string): string {
    const unidad = this.unidadesMedidaDisponibles.find(u => u.idUnidad === idUnidad);
    return unidad ? unidad.descripcion : idUnidad; // Si no encuentra la descripción, muestra el ID
  }

  getDescripcionCategoria(idCategoria: string): string {
    const categoria = this.categoriasDisponibles.find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.descripcion : idCategoria; // Si no encuentra la descripción, muestra el ID
  }
}
