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
  clientes: iCliente[] = [];

  constructor(private clientesService: ClientesService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clientesService.getClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  crearCliente(): void {
    this.router.navigate(['/datos-cliente']); // Navega al formulario vacío
  }

  volver(): void {
    this.router.navigate(['/']); // Vuelve a la pantalla anterior
  }

  editarCliente(idCliente: string): void {
    this.router.navigate(['/datos-cliente', idCliente]); // Navega a datos-cliente con el ID seleccionado
  }

}
