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

  showUserMenu: boolean = false;


  constructor(
    private movieDbService: MovieDbService,
    public authService: AuthService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.scrollToTop();
    
    this.loadPopularMovies();
    this.loadNowPlayingMovies();
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 0);
    
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 50);
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
    console.log('🚪 HOME: Iniciando logout');
    this.showUserMenu = false;
    
    // Deixar o AuthService gerenciar todo o processo de logout
    this.authService.logout();
  }

  goToAccount(): void {
    this.showUserMenu = false;
    // Para agora, vamos apenas mostrar um alerta
    alert(`Informações da conta de ${this.getCurrentUserName()}\n\nEsta funcionalidade será implementada em breve.`);
  }

  goToHome(): void {
    this.showUserMenu = false;
    this.router.navigate(['/home']).then(() => {
      this.scrollToTop();
    });
  }

  goToFavorites(): void {
    console.log('🎬 HOME: Clicou em Filmes Favoritos');
    console.log('🎬 HOME: Tentando navegar para /filmes-favoritos');
    this.showUserMenu = false;
    
    // Força scroll para o topo antes da navegação
    window.scrollTo(0, 0);
    
    this.router.navigate(['/filmes-favoritos']).then((success: boolean) => {
      console.log('🎬 HOME: Navegação bem-sucedida?', success);
      if (success) {
        console.log('🎬 HOME: Navegação realizada com sucesso!');
        // Força scroll novamente após navegação
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      } else {
        console.error('🎬 HOME: ERRO na navegação para /filmes-favoritos');
        // Fallback: navegação forçada
        window.location.href = '/filmes-favoritos';
      }
    }).catch((error) => {
      console.error('🎬 HOME: ERRO na navegação:', error);
      // Fallback: navegação forçada
      window.location.href = '/filmes-favoritos';
    });
  }

  hasUserInStorage(): boolean {
    return !!localStorage.getItem('user');
  }
}
