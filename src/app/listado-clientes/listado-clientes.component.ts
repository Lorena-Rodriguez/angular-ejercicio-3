import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../clientes/clientes.service';
import { iCliente } from '../clientes/clientes.interface';

@Component({
  selector: 'app-listado-clientes',
  standalone: false,
  templateUrl: './listado-clientes.component.html',
  styleUrl: './listado-clientes.component.css'
})
export class ListadoClientesComponent implements OnInit { 
  clientes: iCliente[] = []; // Array para almacenar los clientes

  constructor(private clientesService: ClientesService, private router: Router) {} // Inyecta el servicio de clientes y el router

  // El método ngOnInit se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.obtenerClientes();
  }

  // Método para obtener la lista de clientes desde el servicio
  obtenerClientes(): void {
    this.clientesService.getClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  // Método para eliminar un cliente por su ID
  crearCliente(): void {
    this.router.navigate(['/datos-cliente']); // Navega a la ruta de datos-cliente para crear un nuevo cliente
  }

  // Método para volver a la pantalla anterior
  volver(): void {
    this.router.navigate(['/']); // Vuelve a la pantalla anterior
  }

  // Método para editar un cliente por su ID
  editarCliente(idCliente: string): void {
    this.router.navigate(['/datos-cliente', idCliente]); // Navega a datos-cliente con el ID seleccionado
  }

}
