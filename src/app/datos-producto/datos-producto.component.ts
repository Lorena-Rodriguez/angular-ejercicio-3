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
      this.idProducto = producto.idProducto; // Guardar el idProducto para uso posterior
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
      // 🔹 Asegurar que `idProducto` se mantiene correctamente
      const productoEditado = {
        ...this.formularioProducto.value,
        idProducto: this.idProducto ?? this.formularioProducto.get('idProducto')?.value
      };

      this.productosService.updateProducto(this.id, productoEditado).subscribe(() => {
        alert('Se han guardado los cambios correctamente.');
        this.router.navigate(['/productos']);
      });
    } else {
      // 🔹 Crear producto nuevo
      this.productosService.getProductos().subscribe(productos => {
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
          alert('Producto creado correctamente.');
          this.router.navigate(['/productos']);
        });
      });
    }
  }
}


eliminarProducto(): void {
  if (this.id) {
    // Mostrar confirmación antes de eliminar
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    
    if (confirmacion) {
      this.productosService.deleteProducto(this.id).subscribe(() => {
        // Mostrar mensaje de éxito
        alert('Producto eliminado correctamente.');
        this.router.navigate(['/productos']);
      });
    }
  }
}


volverListadoProductos(): void {
  if (this.formularioProducto.dirty) {
    // Si hay cambios, simplemente volvemos
    this.router.navigate(['/productos']);
  } else {
    // Si NO hay cambios, mostramos la alerta
    const confirmacion = window.confirm('¿Seguro que quiere volver a Inicio sin modificar nada?');
    
    if (confirmacion) {
      this.router.navigate(['/productos']);
    }
  }
}




}
