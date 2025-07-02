import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar se há usuário logado no localStorage ao inicializar
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        console.log('🔄 AuthService: Inicializando com usuário:', userData.name);
        this.currentUserSubject.next(userData);
      } else {
        console.log('🔄 AuthService: Nenhum usuário encontrado no localStorage');
      }
    } catch (error) {
      console.error('❌ AuthService: Erro ao parsear dados do usuário:', error);
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  setCurrentUser(user: any): void {
    console.log('✅ AuthService: Definindo usuário atual:', user.name);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): any {
    const user = this.currentUserSubject.value;
    if (!user) {
      // Tentar recuperar do localStorage se não estiver no BehaviorSubject
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          this.currentUserSubject.next(userData);
          return userData;
        } catch (error) {
          console.error('❌ AuthService: Erro ao recuperar usuário do localStorage:', error);
          localStorage.removeItem('user');
        }
      }
    }
    return user;
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  private clearAuthData(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  logout(): void {
    console.log('🚪 AuthService: Fazendo logout');
    this.clearAuthData();
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getUserName(): string {
    const user = this.getCurrentUser();
    return user ? user.name : 'Usuário';
  }
} 