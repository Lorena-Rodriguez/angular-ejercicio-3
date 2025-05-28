import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioUsuariosService } from '../servicio-usuarios.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosRegistroComponent } from '../usuarios-registro/usuarios-registro.component';

/*
  ! Componente de autenticación de usuario en modo modal.
  * Solicita email y password, valida existencia y formato, y muestra datos del usuario logado.
  TODO: Cumple con las mejores prácticas de accesibilidad y diseño moderno.
*/
@Component({
  selector: 'app-usuarios-auth',
  templateUrl: './usuarios-auth.component.html',
  styleUrls: ['./usuarios-auth.component.css'],
  standalone: false
})
export class UsuariosAuthComponent {
  // * Formulario reactivo para email y password
  authForm: FormGroup;
  // * Controla la visibilidad de la contraseña
  hidePassword: boolean = true;
  // * Mensajes de error personalizados
  emailExistsError: string = '';
  loginError: string = '';
  // * Datos del usuario logado
  usuarioLogado: any = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: ServicioUsuariosService,
    public dialogRef: MatDialogRef<UsuariosAuthComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // * Acción de login
  onLogin() {
    this.loginError = '';
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
      this.usuarioService.login(email, password).subscribe(usuario => {
        if (usuario) {
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.dialogRef.close();
        } else {
          this.loginError = 'El usuario o password no son correctos';
        }
      });
    }
  }

  // * Acción para abrir el modal de registro
  abrirRegistroModal() {
    this.dialogRef.close();
    this.dialog.open(UsuariosRegistroComponent, {
      width: '430px',
      disableClose: true
    });
  }

  // * Acción para volver al componente anterior
  onVolver() {
    this.dialogRef.close();
  }
}
