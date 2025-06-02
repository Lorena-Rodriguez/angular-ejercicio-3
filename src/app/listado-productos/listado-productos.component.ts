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
export class ListadoProductosComponent implements OnInit {
  productos: iProducto[] = [];
  unidadesMedidaDisponibles: { idUnidad: string; descripcion: string }[] = [];
  categoriasDisponibles: { idCategoria: string; descripcion: string }[] = [];

  constructor(private productosService: ProductosService, private router: Router) {}

  ngOnInit(): void {
    forkJoin({
      productos: this.productosService.getProductos(),
      unidades: this.productosService.getUnidadesMedida(),
      categorias: this.productosService.getCategorias()
    }).subscribe(({ productos, unidades, categorias }) => {
      this.productos = productos;
      this.unidadesMedidaDisponibles = unidades.map(u => ({ idUnidad: u.idUnidad, descripcion: u.descripcion }));
      this.categoriasDisponibles = categorias.map(c => ({ idCategoria: c.idCategoria, descripcion: c.descripcion }));
    });
  }

  editarProducto(producto: iProducto): void {
    this.router.navigate(['/datos-producto', producto.id]);
  }

  btncrearProducto(): void {
    this.router.navigate(['/datos-producto']);
  }

  volverPaginaPrincipal(): void {
    this.router.navigate(['/']);
  }

  getDescripcionUnidad(idUnidad: string): string {
    const unidad = this.unidadesMedidaDisponibles.find(u => u.idUnidad === idUnidad);
    return unidad ? unidad.descripcion : idUnidad; // ✅ Si no encuentra la descripción, muestra el ID
  }

  getDescripcionCategoria(idCategoria: string): string {
    const categoria = this.categoriasDisponibles.find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.descripcion : idCategoria; // ✅ Si no encuentra la descripción, muestra el ID
  }
}
