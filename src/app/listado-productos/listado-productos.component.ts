import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../productos/productos.service';
import { iProducto } from '../productos/productos.interface';

@Component({
  selector: 'app-listado-productos',
  standalone: false,
  templateUrl: './listado-productos.component.html',
  styleUrl: './listado-productos.component.css'
})
export class ListadoProductosComponent implements OnInit {
  productos: iProducto[] = [];

  constructor(private productosService: ProductosService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productosService.getProductos().subscribe((productos) => {
      this.productos = productos;
    });
  }

  editarProducto(producto: iProducto): void {
    this.router.navigate(['/datos-producto', producto.id]); // Usa producto.id
  }

  btncrearProducto(): void {
    this.router.navigate(['/datos-producto']);
  }

  volverPaginaPrincipal(): void {
    this.router.navigate(['/']);
  }
}
