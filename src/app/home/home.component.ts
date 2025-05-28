import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  logout() {
    // Lógica de cierre de sesión
    localStorage.clear();
    window.location.href = '/login';
  }
}
