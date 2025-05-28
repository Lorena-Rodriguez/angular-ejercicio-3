import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsuariosAuthComponent } from './usuarios/usuarios-auth/usuarios-auth.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: UsuariosAuthComponent }, // <-- Añade esta línea
  // ...otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
