import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../productos/productos.service';
import { iProducto } from '../productos/productos.interface';


@Component({
  selector: 'app-datos-producto',
  standalone: false,
  templateUrl: './datos-producto.component.html',
  styleUrl: './datos-producto.component.css'
})
export class DatosProductoComponent implements OnInit {
  formularioProducto!: FormGroup;
  idProducto: string | null = null; // Código de producto (Ej: P007)
  id: string | null = null; // ID interno en la base de datos (Ej: 8a85)

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id'); // Solo el id interno

    this.inicializarFormulario();

    if (this.id) {
      this.cargarProducto(this.id);
    }
  }

  inicializarFormulario(): void {
    this.formularioProducto = this.fb.group({
      idProducto: [{ value: this.idProducto, disabled: true }],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      unidadesMedida: ['', Validators.required],
      categoria: ['', Validators.required],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      descuentoVenta: [0, [Validators.min(0), Validators.max(100)]],
      stock: [0, Validators.required]
    });
  }

  cargarProducto(id: string): void {
    this.productosService.getProducto(id).subscribe((producto) => {
      if (producto) {
        this.formularioProducto.patchValue(producto);
      }
    });
  }

  guardarProducto(): void {
    if (this.formularioProducto.valid) {
      if (this.id) {
        // Editar producto existente
        const productoEditado = {
          ...this.formularioProducto.value,
          idProducto: this.formularioProducto.get('idProducto')?.value
        };
        this.productosService.updateProducto(this.id, productoEditado).subscribe(() => {
          this.router.navigate(['/productos']);
        });
      } else {
        // Crear producto nuevo: calcular el siguiente idProducto
        this.productosService.getProductos().subscribe(productos => {
          // Filtra solo los que tienen idProducto en formato PXXX
          const ids = productos
            .map(p => p.idProducto)
            .filter(id => /^P\d+$/.test(id))
            .map(id => parseInt(id.substring(1), 10));
          const max = ids.length > 0 ? Math.max(...ids) : 0;
          const nuevoIdProducto = 'P' + (max + 1).toString().padStart(3, '0');

          const productoNuevo = {
            ...this.formularioProducto.value,
            idProducto: nuevoIdProducto
          };

          this.productosService.addProducto(productoNuevo).subscribe(() => {
            this.router.navigate(['/productos']);
          });
        });
      }
    }
  }

  eliminarProducto(): void {
    if (this.id) {
      this.productosService.deleteProducto(this.id).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    }
  }

  volverListadoProductos(): void {
    this.router.navigate(['/productos']);
  }
}
