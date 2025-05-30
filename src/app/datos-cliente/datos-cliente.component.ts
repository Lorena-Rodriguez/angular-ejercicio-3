import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../clientes/clientes.service';
import { iCliente } from '../clientes/clientes.interface';

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

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientesService.getCliente(id).subscribe((data) => {
        this.cliente = data;
        this.clienteExistente = true;
      });
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
  if (!this.cliente.idCliente) {
    this.cliente.idCliente = 'C' + Math.floor(Math.random() * 1000);  // ✅ Generación de IDCliente único
  }

  if (!this.cliente.id) {
    this.cliente.id = Math.random().toString(36).substring(2, 6); // ✅ Generación de ID único tipo string
  }

  this.clientesService.addCliente(this.cliente).subscribe(() => {
    alert('Cliente creado correctamente');
    this.router.navigate(['/clientes']);
  });
}

}