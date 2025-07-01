import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoginMode = true;
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  toggleMode(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.isLoginMode = !this.isLoginMode;
    
    // Limpar formulários ao trocar de modo
    if (this.isLoginMode) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          console.log('Login realizado com sucesso:', response);
          this.authService.setCurrentUser(response);
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          console.error('Erro no login:', error);
          alert('Email ou senha incorretos!');
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      
      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          console.log('Cadastro realizado com sucesso:', response);
          alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
          this.isLoginMode = true;
          this.loginForm.patchValue({ email: registerData.email });
        },
        error: (error: any) => {
          console.error('Erro no cadastro:', error);
          alert('Erro ao cadastrar. Email pode já estar em uso.');
        }
      });
    }
  }

}
