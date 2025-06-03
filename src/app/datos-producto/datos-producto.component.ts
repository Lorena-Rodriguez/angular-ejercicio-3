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
  formularioProducto!: FormGroup; // Formulario reactivo para gestionar los datos del producto
  idProducto: string | null = null; // Almacena el ID del producto actual
  id: string | null = null; // Almacena el ID del producto desde la ruta

  constructor( // Inyecta el FormBuilder, ActivatedRoute y Router
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService
  ) {}

ngOnInit(): void {
  this.id = this.route.snapshot.paramMap.get('id'); // Obtiene el ID del producto desde la ruta

  forkJoin({ // Utiliza forkJoin para obtener unidades de medida y categorías en paralelo
    unidades: this.productosService.getUnidadesMedida(),
    categorias: this.productosService.getCategorias()
  }).subscribe(({ unidades, categorias }) => { // Desestructura la respuesta para obtener unidades y categorías
    this.unidadesMedidaDisponibles = unidades.map(u => ({ idUnidad: u.idUnidad, descripcion: u.descripcion }));
    this.categoriasDisponibles = categorias.map(c => ({ idCategoria: c.idCategoria, descripcion: c.descripcion }));

    this.inicializarFormulario(); // Inicializa el formulario con los datos obtenidos

    if (this.id) {
      this.cargarProducto(this.id); // Si hay un ID, carga los datos del producto
    }
  });
}

  // Lista de unidades de medida disponibles
  unidadesMedidaDisponibles: { idUnidad: string; descripcion: string }[] = [];

  // Lista de categorías disponibles
  categoriasDisponibles: { idCategoria: string; descripcion: string }[] = [];


  inicializarFormulario(): void { // Inicializa el formulario reactivo con los campos necesarios y sus validaciones
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      unidadesMedida: ['', Validators.required], 
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

  // Método para cargar un producto específico por su ID
  cargarProducto(id: string): void {
    this.productosService.getProducto(id).subscribe((producto) => {
      if (producto) {
        this.idProducto = producto.idProducto; // Guardar el idProducto para uso posterior
        console.log('Producto obtenido:', producto);

        this.formularioProducto.patchValue(producto);

        // Seleccionar la unidad de medida correcta por descripción
        const unidadSeleccionada = this.unidadesMedidaDisponibles.find(u => u.descripcion === producto.unidadesMedida);
        console.log('Unidad seleccionada en lista:', unidadSeleccionada);
        if (unidadSeleccionada) {
          this.formularioProducto.get('unidadesMedida')?.setValue(unidadSeleccionada.idUnidad);
        }

        // Seleccionar la categoría correcta por descripción
        const categoriaSeleccionada = this.categoriasDisponibles.find(c => c.descripcion === producto.categoria);
        console.log('Categoría seleccionada en lista:', categoriaSeleccionada);
        if (categoriaSeleccionada) {
          this.formularioProducto.get('categoria')?.setValue(categoriaSeleccionada.idCategoria);
        }
      }
    });
  }

  // Método para guardar el producto, ya sea editando uno existente o creando uno nuevo
  guardarProducto(): void {
    if (this.formularioProducto.valid) {
      if (this.id) {
        // Asegurar que `idProducto` se mantiene correctamente
        const productoEditado = {
          ...this.formularioProducto.value,
          idProducto: this.idProducto ?? this.formularioProducto.get('idProducto')?.value // Si idProducto no está definido, usa el valor del formulario
        };

        this.productosService.updateProducto(this.id, productoEditado).subscribe(() => { // Actualizar producto existente
          alert('Se han guardado los cambios correctamente.');
          this.router.navigate(['/productos']);
        });
      } else {
        // Crear producto nuevo
        this.productosService.getProductos().subscribe(productos => { // Obtener la lista de productos para generar un nuevo ID
          const ids = productos
            .map(p => p.idProducto)
            .filter(id => /^P\d+$/.test(id)) // Filtrar IDs que comienzan con 'P'
            .map(id => parseInt(id.substring(1), 10)); // Convertir a números enteros
          const max = ids.length > 0 ? Math.max(...ids) : 0; // Obtener el máximo ID existente
          const nuevoIdProducto = 'P' + (max + 1).toString().padStart(3, '0'); // Generar nuevo ID con formato 'P001', 'P002', etc.

          const productoNuevo = { // Crear un nuevo producto con el ID generado
            ...this.formularioProducto.value, // Usar los valores del formulario
            idProducto: nuevoIdProducto // Asignar el nuevo ID generado
          };

          this.productosService.addProducto(productoNuevo).subscribe(() => { // Agregar el nuevo producto
            alert('Producto creado correctamente.');
            this.router.navigate(['/productos']); // Navegar a la lista de productos
          });
        });
      }
    }
  }

  // Método para eliminar un producto por su ID
  eliminarProducto(): void {
    if (this.id) { // Verifica si hay un ID de producto
      // Mostrar confirmación antes de eliminar
      const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
      
      if (confirmacion) {
        this.productosService.deleteProducto(this.id).subscribe(() => { // Eliminar producto
          // Mostrar mensaje de éxito
          alert('Producto eliminado correctamente.');
          this.router.navigate(['/productos']); // Navegar a la lista de productos
        });
      }
    }
  }

// Método para volver a la lista de productos
  volverListadoProductos(): void {
    if (this.formularioProducto.dirty) { // Verifica si el formulario ha sido modificado
      this.router.navigate(['/productos']); // Navega a la lista de productos
    } else {
      // Si NO hay cambios, mostramos la alerta
      const confirmacion = window.confirm('¿Seguro que quiere volver a Inicio sin modificar nada?');
      
      if (confirmacion) {
        this.router.navigate(['/productos']); // Navega a la lista de productos
      }
    }
  }
}
