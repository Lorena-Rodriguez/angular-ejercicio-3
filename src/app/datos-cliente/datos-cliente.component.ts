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

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private poblacionService: PoblacionService
  ) {}

  ngOnInit(): void {
    const idCliente = this.route.snapshot.paramMap.get('idCliente'); // 🔹 Captura el ID desde la URL

    // Prueba manual para obtener poblaciones por código postal QUITAR DESPUÉS DE LAS PRUEBAS
      this.poblacionService.getPoblacionesPorCodigoPostal('28008').subscribe(
    (poblaciones) => console.log('Prueba manual: ', poblaciones),
    (error) => console.error('Error en prueba manual:', error)
  );


    if (idCliente) {
      this.clientesService.getCliente(idCliente).subscribe(
        (clientes) => {
          if (clientes.length > 0) {
            this.cliente = clientes[0]; // Asigna el primer cliente encontrado
            //  console.log('Cliente cargado:', this.cliente);
            this.clienteExistente = true;
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
      this.clienteExistente = false;
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


  volver(): void {
    if (this.clienteExistente) {
      const confirmacion = confirm('¿Seguro que deseas volver sin guardar cambios?');
      if (!confirmacion) return;
    }
    this.router.navigate(['/clientes']);
  }

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

guardar(): void {
  if (this.clienteExistente) {  // 🔹 Si el cliente ya existe, lo actualizamos
    this.clientesService.updateCliente(this.cliente.id, this.cliente).subscribe(() => {
      alert('Cliente actualizado correctamente');
      this.router.navigate(['/clientes']);
    });
  } else {  // 🔹 Si es un cliente nuevo, lo agregamos
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

// actualizarProvincia(): void {
//   if (this.cliente.codigoPostal.length === 5) { // ✅ Solo busca si hay 5 caracteres
//     this.poblacionService.getProvinciaPorCodigoPostal(this.cliente.codigoPostal).subscribe(
//       (poblaciones) => {
//         if (poblaciones.length > 0) {
//           this.cliente.provincia = poblaciones[0].provincia; // ✅ Asigna la provincia encontrada
//         } else {
//           this.cliente.provincia = ''; // 🔹 Vacía el campo si no hay coincidencias
//         }
//       }
//     );
//   }
// }

actualizarProvincia(): void {
  if (this.cliente.codigoPostal.length === 5) {  
    this.poblacionService.getProvinciaPorCodigoPostal(this.cliente.codigoPostal).subscribe(
      (poblaciones) => {
        console.log('Datos obtenidos de la API para provincia:', poblaciones); // ✅ Verifica los datos
        if (poblaciones.length > 0) {
          this.cliente.provincia = poblaciones[0].provincia;
        } else {
          this.cliente.provincia = ''; // 🔹 Si no hay coincidencias, deja vacío
        }
        console.log('Provincia asignada:', this.cliente.provincia);
      }
    );
  }
}

poblacionesDisponibles: iPoblaciones[] = []; // 🔹 Almacena las poblaciones disponibles

actualizarPoblaciones(): void {
  if (this.cliente.codigoPostal.length === 5) {  
    this.poblacionService.getPoblacionesPorCodigoPostal(this.cliente.codigoPostal).subscribe(
      (poblaciones) => {
        console.log('Datos obtenidos de la API para poblaciones:', poblaciones); // ✅ Verifica los datos
        this.poblacionesDisponibles = poblaciones;
        console.log('Lista de poblaciones disponibles después de asignar:', this.poblacionesDisponibles);
      },
      (error) => console.error('Error al buscar poblaciones:', error)
    );
  }
}








}