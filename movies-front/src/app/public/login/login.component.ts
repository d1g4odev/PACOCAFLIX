import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/home';
  
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required, 
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  });

  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s]+$/)
    ]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
    ])
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Scroll para o topo
    window.scrollTo(0, 0);
    
    // Verificar se já está logado
    if (this.authService.isLoggedIn()) {
      console.log('👤 Login: Usuário já está logado, redirecionando');
      this.router.navigate(['/home']);
      return;
    }
    
    // Capturar URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    console.log('🔄 Login: URL de retorno definida como:', this.returnUrl);
  }

  toggleMode(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.isLoginMode = !this.isLoginMode;
    this.clearError();
    
    // Limpar formulários ao trocar de modo
    if (this.isLoginMode) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
  }

  onLogin() {
    this.clearError();
    
    if (!this.validateLoginForm()) {
      return;
    }

    this.isLoading = true;
    const loginData = this.loginForm.value;
    
    console.log('🔐 Login: Tentando fazer login com:', loginData.email);
    
    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('✅ Login realizado com sucesso:', response);
        this.authService.setCurrentUser(response);
        
        // Navegar para URL de retorno ou home
        this.router.navigate([this.returnUrl]).then(() => {
          console.log('🏠 Redirecionado para:', this.returnUrl);
        });
      },
      error: (error: any) => {
        console.error('❌ Erro no login:', error);
        this.handleLoginError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    this.clearError();
    
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isLoading = true;
    const registerData = this.registerForm.value;
    
    console.log('📝 Registro: Tentando cadastrar:', registerData.email);
    
    this.authService.register(registerData).subscribe({
      next: (response: any) => {
        console.log('✅ Cadastro realizado com sucesso:', response);
        alert('🎉 Cadastro realizado com sucesso! Agora você pode fazer login.');
        this.isLoginMode = true;
        this.loginForm.patchValue({ email: registerData.email });
      },
      error: (error: any) => {
        console.error('❌ Erro no cadastro:', error);
        this.handleRegisterError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateLoginForm(): boolean {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      
      if (this.loginForm.get('email')?.hasError('required')) {
        this.setError('Por favor, digite seu email.');
        return false;
      }
      if (this.loginForm.get('email')?.hasError('email') || this.loginForm.get('email')?.hasError('pattern')) {
        this.setError('Por favor, digite um email válido.');
        return false;
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.setError('Por favor, digite sua senha.');
        return false;
      }
      if (this.loginForm.get('password')?.hasError('minlength')) {
        this.setError('A senha deve ter pelo menos 3 caracteres.');
        return false;
      }
    }
    return true;
  }

  private validateRegisterForm(): boolean {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      
      if (this.registerForm.get('name')?.hasError('required')) {
        this.setError('Por favor, digite seu nome.');
        return false;
      }
      if (this.registerForm.get('name')?.hasError('minlength')) {
        this.setError('O nome deve ter pelo menos 2 caracteres.');
        return false;
      }
      if (this.registerForm.get('name')?.hasError('pattern')) {
        this.setError('O nome deve conter apenas letras.');
        return false;
      }
      if (this.registerForm.get('email')?.hasError('required')) {
        this.setError('Por favor, digite seu email.');
        return false;
      }
      if (this.registerForm.get('email')?.hasError('email') || this.registerForm.get('email')?.hasError('pattern')) {
        this.setError('Por favor, digite um email válido.');
        return false;
      }
      if (this.registerForm.get('password')?.hasError('required')) {
        this.setError('Por favor, digite uma senha.');
        return false;
      }
      if (this.registerForm.get('password')?.hasError('minlength')) {
        this.setError('A senha deve ter pelo menos 6 caracteres.');
        return false;
      }
      if (this.registerForm.get('password')?.hasError('pattern')) {
        this.setError('A senha deve conter pelo menos uma letra e um número.');
        return false;
      }
    }
    return true;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.setError('Email ou senha incorretos. Verifique suas credenciais.');
    } else if (error.status === 0) {
      this.setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } else {
      this.setError('Erro inesperado. Tente novamente em alguns instantes.');
    }
  }

  private handleRegisterError(error: any) {
    if (error.status === 409) {
      this.setError('Este email já está em uso. Tente outro email.');
    } else if (error.status === 0) {
      this.setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } else {
      this.setError('Erro no cadastro. Tente novamente em alguns instantes.');
    }
  }

  private setError(message: string) {
    this.errorMessage = message;
  }

  private clearError() {
    this.errorMessage = '';
  }

  // Getters para facilitar acesso aos controles nos templates
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }
  get registerName() { return this.registerForm.get('name'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }

  // Métodos para validar requisitos da senha
  hasMinLength(): boolean {
    const password = this.registerPassword?.value;
    return password ? password.length >= 6 : false;
  }

  hasLetter(): boolean {
    const password = this.registerPassword?.value;
    return password ? /[a-zA-Z]/.test(password) : false;
  }

  hasNumber(): boolean {
    const password = this.registerPassword?.value;
    return password ? /\d/.test(password) : false;
  }
}
