import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosAuthComponent } from './usuarios/usuarios-auth/usuarios-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'; // <-- Añade esta línea
import { HttpClientModule } from '@angular/common/http';
import { UsuariosRegistroComponent } from './usuarios/usuarios-registro/usuarios-registro.component';
import { ListadoClientesComponent } from './listado-clientes/listado-clientes.component';
import { DatosClienteComponent } from './datos-cliente/datos-cliente.component';
import { PoblacionService } from './poblacion/poblacion.service';
import { ListadoProductosComponent } from './listado-productos/listado-productos.component';
import { DatosProductoComponent } from './datos-producto/datos-producto.component'; // Asegúrate de que la ruta sea correcta

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsuariosAuthComponent,
    UsuariosRegistroComponent,
    ListadoClientesComponent,
    DatosClienteComponent,
    ListadoProductosComponent,
    DatosProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
