import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsuariosAuthComponent } from './usuarios/usuarios-auth/usuarios-auth.component';
import { ListadoClientesComponent } from './listado-clientes/listado-clientes.component';
import { DatosClienteComponent } from './datos-cliente/datos-cliente.component';
import { ListadoProductosComponent } from './listado-productos/listado-productos.component';
import { DatosProductoComponent } from './datos-producto/datos-producto.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: UsuariosAuthComponent },
  { path: 'clientes', component: ListadoClientesComponent },
  { path: 'datos-cliente/:idCliente', component: DatosClienteComponent },
  { path: 'datos-cliente', component: DatosClienteComponent }, // <-- Añade esta línea
    { path: 'productos', component: ListadoProductosComponent }, // ✅ Añadido
  { path: 'datos-producto/:idProducto', component: DatosProductoComponent }, // ✅ Para edición de productos
  { path: 'datos-producto', component: DatosProductoComponent } // ✅ Para creación de productos
  // ...otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
