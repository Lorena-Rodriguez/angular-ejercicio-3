import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../productos/productos.service';
import { iProducto } from '../productos/productos.interface';
import { forkJoin } from 'rxjs';

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
  this.id = this.route.snapshot.paramMap.get('id');

  forkJoin({
    unidades: this.productosService.getUnidadesMedida(),
    categorias: this.productosService.getCategorias()
  }).subscribe(({ unidades, categorias }) => {
    this.unidadesMedidaDisponibles = unidades.map(u => ({ idUnidad: u.idUnidad, descripcion: u.descripcion }));
    this.categoriasDisponibles = categorias.map(c => ({ idCategoria: c.idCategoria, descripcion: c.descripcion }));

    this.inicializarFormulario();

    if (this.id) {
      this.cargarProducto(this.id);
    }
  });
}




  // Lista de unidades de medida disponibles
  unidadesMedidaDisponibles: { idUnidad: string; descripcion: string }[] = [];


  // Lista de categorías disponibles
  categoriasDisponibles: { idCategoria: string; descripcion: string }[] = [];


  inicializarFormulario(): void {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      unidadesMedida: ['', Validators.required], // Campo select con validación
      categoria: ['', Validators.required],
      precioVenta: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      descuentoVenta: ['', [Validators.min(0), Validators.max(100)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });

    // Si ya existe un valor de unidades de medida, lo establece en el formulario
    if (this.formularioProducto.get('unidadesMedida')?.value) {
      this.formularioProducto.get('unidadesMedida')?.setValue(this.formularioProducto.get('unidadesMedida')?.value);
    }
  }


cargarProducto(id: string): void {
  this.productosService.getProducto(id).subscribe((producto) => {
    if (producto) {
      console.log('Producto obtenido:', producto);

      this.formularioProducto.patchValue(producto);

      // 🔹 Seleccionar la unidad de medida correcta por descripción
      const unidadSeleccionada = this.unidadesMedidaDisponibles.find(u => u.descripcion === producto.unidadesMedida);
      console.log('Unidad seleccionada en lista:', unidadSeleccionada);
      if (unidadSeleccionada) {
        this.formularioProducto.get('unidadesMedida')?.setValue(unidadSeleccionada.idUnidad);
      }

      // 🔹 Seleccionar la categoría correcta por descripción
      const categoriaSeleccionada = this.categoriasDisponibles.find(c => c.descripcion === producto.categoria);
      console.log('Categoría seleccionada en lista:', categoriaSeleccionada);
      if (categoriaSeleccionada) {
        this.formularioProducto.get('categoria')?.setValue(categoriaSeleccionada.idCategoria);
      }
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
