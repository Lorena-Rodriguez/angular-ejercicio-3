import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioUsuariosService } from '../servicio-usuarios.service';
import { MatDialogRef } from '@angular/material/dialog';

/*
  ! Componente de registro de usuario.
  * Solicita email, confirmación de email, nombre, apellidos, password y confirmación de password.
  TODO: Cumple con las mejores prácticas de accesibilidad y diseño moderno.
*/
@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css'],
  standalone: false
})
export class UsuariosRegistroComponent {
  registroForm: FormGroup;
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  emailExistsError: string = '';
  registroError: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: ServicioUsuariosService,
    public dialogRef: MatDialogRef<UsuariosRegistroComponent>
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellidouno: ['', [Validators.required]],
      apellidodos: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{5,}$/)
      ]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: [UsuariosRegistroComponent.matchEmails, UsuariosRegistroComponent.matchPasswords] });
  }

  static matchEmails(group: FormGroup) {
    const email = group.get('email')?.value;
    const emailConfirm = group.get('emailConfirm')?.value;
    return email && emailConfirm && email === emailConfirm ? null : { emailsNoMatch: true };
  }

  static matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const passwordConfirm = group.get('passwordConfirm')?.value;
    return password && passwordConfirm && password === passwordConfirm ? null : { passwordsNoMatch: true };
  }

  checkEmailExists() {
    const email = this.registroForm.get('email')?.value;
    const emailConfirm = this.registroForm.get('emailConfirm')?.value;
    if (
      email &&
      emailConfirm &&
      this.registroForm.get('email')?.valid &&
      this.registroForm.get('emailConfirm')?.valid &&
      email === emailConfirm
    ) {
      this.usuarioService.getUsuarioByEmail(email).subscribe(usuario => {
        this.emailExistsError = usuario ? 'El email ya está registrado.' : '';
      });
    } else {
      this.emailExistsError = '';
    }
  }

  onRegistrar() {
    this.registroError = '';
    if (this.registroForm.valid && !this.emailExistsError) {
      const { email, nombre, apellidouno, apellidodos, password } = this.registroForm.value;
      this.usuarioService.registrar({
        email,
        nombre,
        apellidouno,
        apellidodos,
        password
      }).subscribe({
        next: () => this.dialogRef.close(),
        error: () => this.registroError = 'Error al registrar el usuario. Inténtelo de nuevo.'
      });
    } else {
      this.registroError = 'Por favor, revise los errores del formulario.';
    }
  }

  onVolver() {
    this.dialogRef.close();
  }
}
