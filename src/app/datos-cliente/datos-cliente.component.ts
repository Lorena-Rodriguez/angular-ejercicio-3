import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../clientes/clientes.service';
import { iCliente } from '../clientes/clientes.interface';
import { PoblacionService } from '../poblacion/poblacion.service'; // Asegúrate de que la ruta sea correcta
import { iPoblaciones } from '../poblacion/poblacion.interface';

@Component({
  selector: 'app-datos-cliente',
  standalone: false,
  templateUrl: './datos-cliente.component.html',
  styleUrls: ['./datos-cliente.component.css']
})

// Componente para gestionar los datos de un cliente
export class DatosClienteComponent implements OnInit {
  cliente: iCliente = {
    idCliente: '',
    nombre: '',
    apellidoUno: '',
    apellidoDos: '',
    direccion: '',
    codigoPostal: '',
    provincia: '',
    poblacion: '',
    email: '',
    telefonoFijo: '',
    telefonoMovil: '',
    nif: '',
    id: ''
  };
  clienteExistente = false;
console: any;

// Se inyectan los servicios necesarios
  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private poblacionService: PoblacionService
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    const idCliente = this.route.snapshot.paramMap.get('idCliente'); // Captura el ID desde la URL

    // Si hay un ID de cliente en la URL, se carga el cliente correspondiente
    if (idCliente) {
      this.clientesService.getCliente(idCliente).subscribe(
        (clientes) => {
          if (clientes.length > 0) {
            this.cliente = clientes[0]; // Asigna el primer cliente encontrado
            this.clienteExistente = true; // Marca que el cliente ya existe
            // Añade esta línea:
            if (this.cliente.codigoPostal && this.cliente.codigoPostal.length === 5) { // Verifica que el código postal tenga 5 dígitos
              this.actualizarPoblaciones();
            }
          } else {
            alert('Cliente no encontrado');
            this.router.navigate(['/clientes']); // Redirige si el cliente no existe
          }
        },
        (error) => {
          console.error('Error obteniendo el cliente:', error);
          alert('Ocurrió un error al cargar el cliente.');
        }
      );
    } else {
      this.clienteExistente = false; // Marca que no existe un cliente previo
      // Si no hay ID, inicializa un cliente vacío
      this.cliente = {
        idCliente: '',
        nombre: '',
        apellidoUno: '',
        apellidoDos: '',
        direccion: '',
        codigoPostal: '',
        provincia: '',
        poblacion: '',
        email: '',
        telefonoFijo: '',
        telefonoMovil: '',
        nif: '',
        id: ''
      };
    }
  }

  // Métodos para manejar las acciones del componente
  // Método para volver a la lista de clientes
  volver(): void {
    if (this.clienteExistente) {
      const confirmacion = confirm('¿Seguro que deseas volver sin guardar cambios?');
      if (!confirmacion) return;
    }
    this.router.navigate(['/clientes']);
  }

  // Método para borrar un cliente
  borrar(): void {
    if (this.clienteExistente) {
      const confirmacion = confirm('¿Seguro que deseas borrar este cliente?');
      if (confirmacion) {
        this.clientesService.deleteCliente(this.cliente.id).subscribe(() => {
          alert('Cliente eliminado correctamente');
          this.router.navigate(['/clientes']);
        });
      }
    }
  }

  // Método para guardar un cliente
guardar(): void {
  if (this.clienteExistente) {  // Si el cliente ya existe, lo actualizamos
    this.clientesService.updateCliente(this.cliente.id, this.cliente).subscribe(() => {
      alert('Cliente actualizado correctamente');
      this.router.navigate(['/clientes']);
    });
  } else {  // Si es un cliente nuevo, lo agregamos
    if (!this.cliente.idCliente) {
      this.cliente.idCliente = 'C' + Math.floor(Math.random() * 1000);
    }

    if (!this.cliente.id) {
      this.cliente.id = Math.random().toString(36).substring(2, 6);
    }

    this.clientesService.addCliente(this.cliente).subscribe(() => {
      alert('Cliente creado correctamente');
      this.router.navigate(['/clientes']);
    });
  }
}

  // Método para actualizar la provincia según el código postal
  actualizarProvincia(): void {
    if (this.cliente.codigoPostal.length === 5) {  
      this.poblacionService.getProvinciaPorCodigoPostal(this.cliente.codigoPostal).subscribe(
        (poblaciones) => {
          console.log('Datos obtenidos de la API para provincia:', poblaciones); // Verifica los datos
          if (poblaciones.length > 0) {
            this.cliente.provincia = poblaciones[0].provincia;
          } else {
            this.cliente.provincia = ''; // Si no hay coincidencias, deja vacío
          }
          console.log('Provincia asignada:', this.cliente.provincia);
        }
      );
    }
  }

poblacionesDisponibles: iPoblaciones[] = []; // Almacena las poblaciones disponibles

  // Método para actualizar las poblaciones disponibles según el código postal
actualizarPoblaciones(): void {
  if (this.cliente.codigoPostal.length === 5) {  
    this.poblacionService.getPoblacionesPorCodigoPostal(this.cliente.codigoPostal).subscribe(
      (poblaciones) => {
        console.log('Datos obtenidos de la API para poblaciones:', poblaciones); 
        this.poblacionesDisponibles = poblaciones;
        console.log('Lista de poblaciones disponibles después de asignar:', this.poblacionesDisponibles);
      },
      (error) => console.error('Error al buscar poblaciones:', error)
    );
  }
}

//Validación del NIF
esNifValido(nif: string): boolean {
  if (!nif) return false; // Verifica que el NIF no esté vacío
  const nifPattern = /^[0-9]{8}[A-Za-z]$/; // Expresión regular para validar el formato del NIF
  if (!nifPattern.test(nif)) return false; // Verifica que el NIF tenga 8 dígitos seguidos de una letra
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'; // Letras válidas para el NIF español
  const numero = parseInt(nif.substring(0, 8), 10); // Extrae los primeros 8 dígitos del NIF
  const letra = nif.charAt(8).toUpperCase(); // Extrae la letra del NIF y la convierte a mayúsculas
  return letras.charAt(numero % 23) === letra; // Compara la letra calculada con la del NIF
}
}