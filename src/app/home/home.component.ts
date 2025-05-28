import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosAuthComponent } from '../usuarios/usuarios-auth/usuarios-auth.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  usuarioLogado: any = null;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.recuperarUsuario();
  }

  // * Recupera el usuario logado desde localStorage si existe
  recuperarUsuario() {
    const usuario = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = usuario ? JSON.parse(usuario) : null;
  }

  // * Método para cerrar sesión y cerrar la aplicación/navegador
  salir() {
    localStorage.removeItem('usuarioLogado');
    this.usuarioLogado = null;
    window.close();
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 300);
  }

  // * Método para abrir el modal de login
  abrirLoginModal() {
    const dialogRef = this.dialog.open(UsuariosAuthComponent, {
      width: '430px',
      disableClose: true
    });

    // * Al cerrar el modal, actualiza el usuario logado
    dialogRef.afterClosed().subscribe(() => {
      this.recuperarUsuario();
    });
  }
}
