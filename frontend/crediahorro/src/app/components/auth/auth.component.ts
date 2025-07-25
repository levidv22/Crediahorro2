import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserDto, RegisterDto } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  loginData: UserDto = { username: '', password: '' };
  registerData: RegisterDto = { username: '', password: '', whatsapp: '', email: '' };
  errorMessage: string = '';
  passwordTouched: boolean = false;
  passwordValid: boolean = false;
  isLoading: boolean = false;
  showEmailField: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkAdminExists();
  }

  checkAdminExists(): void {
    this.http.get<boolean>(`${environment.apiUrl}/auth-service/auth/admin-exists`)
      .subscribe({
        next: (twoAdminsExist) => {
          this.showEmailField = !twoAdminsExist;
          if (twoAdminsExist) {
            this.registerData.email = '';
          }
        },
        error: () => {
          this.notificationService.show('error', 'Error verificando admin.');
        }
      });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.passwordTouched = false;
    this.passwordValid = false;
    if (!this.isLoginMode) {
      this.checkAdminExists();
    }
  }

  validatePassword(): void {
    const pwd = this.registerData.password;
    this.passwordValid = !!pwd && pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd);
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.isLoading = true; // Mostrar cargando

      this.authService.login(this.loginData).subscribe({
        next: () => {
          this.notificationService.show('success', 'Código enviado a su email.');
          this.router.navigate(['/verify-code']);
          this.isLoading = false; // Ocultar cargando
        },
        error: () => {
          this.isLoading = false; // Ocultar cargando incluso si hay error
          this.notificationService.show('error', 'Usuario o contraseña incorrectos.');
        },
      });
    } else {
      this.validatePassword();
      if (!this.passwordValid) {
        this.notificationService.show('error', 'Revise el requisito de la contraseña.');
        return;
      }

      if (!this.showEmailField) {
        this.registerData.email = '';
      }

      this.isLoading = true; // Mostrar cargando al registrar
      this.authService.register(this.registerData).subscribe({
        next: () => {
          this.notificationService.show('success', 'Registro exitoso.');
          this.isLoginMode = true;
          this.isLoading = false; // Ocultar cargando
        },
        error: (err) => {
          console.error(err);
          this.notificationService.show('error', 'Hubo un error al registrarse.');
          this.isLoading = false; // Ocultar cargando si hay error
        },
      });
    }
  }


  showPasswordLogin: boolean = false;
  showPasswordRegister: boolean = false;

  togglePasswordVisibility(tipo: 'login' | 'register'): void {
    if (tipo === 'login') {
      this.showPasswordLogin = !this.showPasswordLogin;
    } else {
      this.showPasswordRegister = !this.showPasswordRegister;
    }
  }
}
