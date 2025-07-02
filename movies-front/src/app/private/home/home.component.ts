import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { SwiperComponent } from "swiper/angular";

import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { MovieDbService } from 'src/app/services/movie-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { Router } from '@angular/router';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;

  movies: Array<any> = [];
  popularMovies: Array<any> = [];
  nowPlayingMovies: Array<any> = [];
  isScrolled: boolean = false;
  favoriteMovies: Set<number> = new Set();
  showUserMenu: boolean = false;
  showDebugPanel: boolean = false;

  constructor(
    private movieDbService: MovieDbService,
    public authService: AuthService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    // Forçar scroll to top imediato
    this.scrollToTop();
    
    this.loadPopularMovies();
    this.loadNowPlayingMovies();
    this.loadFavorites();
  }

  // Método robusto para scroll to top
  private scrollToTop(): void {
    // Scroll imediato
    window.scrollTo(0, 0);
    
    // Backup com smooth após DOM render
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
    
    // Backup final para garantir
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 100);
  }

  // Listen to scroll events for floating navbar
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Show floating navbar when scrolled past logo section (approximately 150px)
    this.isScrolled = window.pageYOffset > 150;
  }

  // Close user menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu');
    
    if (!userMenu && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  loadPopularMovies(): void {
    this.movieDbService.getPopularMovies().subscribe({
      next: (response) => {
        this.popularMovies = response.results.slice(0, 10); // Top 10 populares
        this.movies = this.popularMovies; // Para o slider principal
        
        console.log('Filmes populares carregados:', this.popularMovies);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes populares:', error);
      }
    });
  }

  loadNowPlayingMovies(): void {
    this.movieDbService.getNowPlayingMovies().subscribe({
      next: (response) => {
        this.nowPlayingMovies = response.results.slice(0, 8); // Top 8 em cartaz
        
        console.log('Filmes em cartaz carregados:', this.nowPlayingMovies);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes em cartaz:', error);
      }
    });
  }

  returnSrc(backdrop_path: string| undefined): string | undefined{
    if(backdrop_path != null){
      return 'url(https://image.tmdb.org/t/p/original/' + backdrop_path + ')';
    } 
    return undefined;
  }

  gotoDetails(id: number | undefined){
    if (id) {
      this.router.navigate(["/details/", id]).then(() => {
        this.scrollToTop();
      });
    }
  }

  getImageUrl(posterPath: string): string {
    return this.movieDbService.getImageUrl(posterPath);
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  getCurrentUserName(): string {
    return this.authService.getUserName();
  }

  // Toggle user dropdown menu
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToFavorites(): void {
    this.showUserMenu = false;
    console.log('🔗 Home: Navegando para favoritos...');
    console.log('🔍 Home: Estado atual de autenticação:', this.authService.isLoggedIn());
    console.log('👤 Home: Usuário atual:', this.authService.getCurrentUser());
    
    // Pequeno delay para garantir que o estado de autenticação está estável
    setTimeout(() => {
      this.router.navigate(['/favorites']).then(() => {
        console.log('✅ Home: Navegação para favoritos completada');
        this.scrollToTop();
      }).catch(error => {
        console.error('❌ Home: Erro na navegação para favoritos:', error);
      });
    }, 100);
  }

  goToAccount(): void {
    this.showUserMenu = false;
    // Para agora, vamos apenas mostrar um alerta
    alert(`Informações da conta de ${this.getCurrentUserName()}\n\nEsta funcionalidade será implementada em breve.`);
  }

  // Load user's favorite movies
  loadFavorites(): void {
    // TODO: Implement API call to load user favorites
    // For now, using mock data
    this.favoriteMovies = new Set([550, 299536, 157336]); // Mock favorite movie IDs
  }

  // Check if a movie is in favorites
  isFavorite(movieId: number): boolean {
    return this.favoriteMovies.has(movieId);
  }

  // Toggle favorite status
  toggleFavorite(movieId: number): void {
    if (this.isFavorite(movieId)) {
      this.favoriteMovies.delete(movieId);
    } else {
      this.favoriteMovies.add(movieId);
    }
    // TODO: Implement API call to update favorites
  }

  goToHome(): void {
    this.showUserMenu = false;
    this.router.navigate(['/home']).then(() => {
      this.scrollToTop();
    });
  }

  // Debug Methods
  toggleDebugPanel(): void {
    this.showDebugPanel = !this.showDebugPanel;
    console.log('🔍 Debug Panel:', this.showDebugPanel ? 'ABERTO' : 'FECHADO');
  }

  hasUserInStorage(): boolean {
    return !!localStorage.getItem('user');
  }

  testFavorites(): void {
    console.log('🧪 Testando navegação para favoritos...');
    console.log('📊 Estado atual:');
    console.log('  - AuthService.isLoggedIn():', this.authService.isLoggedIn());
    console.log('  - AuthService.getCurrentUser():', this.authService.getCurrentUser());
    console.log('  - localStorage.user:', !!localStorage.getItem('user'));
    
    this.goToFavorites();
  }

}
