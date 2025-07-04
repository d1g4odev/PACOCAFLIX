import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evaluation } from 'src/app/models/Evaluation';
import { Movie } from 'src/app/models/Movie';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { MovieDbService } from 'src/app/services/movie-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

let cont = 0; 

@Component({
  selector: 'app-details-movie',
  templateUrl: './details-movie.component.html',
  styleUrls: ['./details-movie.component.scss']
})
export class DetailsMovieComponent implements OnInit, OnDestroy {

  public comment: string | undefined
  public authorName: string | undefined
  public userRating: number = 5
  public evaluations: Array<Evaluation> = []
  public foundMovie: Movie | undefined
  public movie: any
  public linkTrailer: string = '';
  
  public isFavorited: boolean = false
  public favoriteLoading: boolean = false
  public evaluationLoading: boolean = false
  public hoverRating: number = 0

  constructor(
    private activeRoute: ActivatedRoute,
    private movieDbService: MovieDbService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.forceScrollToTop();
    
    let id = Number(this.activeRoute.snapshot.paramMap.get('id'));
    
    this.movieDbService.getMovieDetails(id).subscribe({
      next: (movieDetails: any) => {
        movieDetails.release_date = movieDetails.release_date?.split("-")[0];
        movieDetails.genre = movieDetails.genres?.[0];
        this.movie = movieDetails;
        
        this.checkFavoriteStatus(id);
        
        this.movieDbService.getMovieVideos(id).subscribe({
          next: (videos: any) => {
            const trailer = videos.results?.find((video: any) => 
              video.type === 'Trailer' && video.site === 'YouTube'
            );
            if (trailer) {
              this.linkTrailer = `https://www.youtube.com/embed/${trailer.key}`;
            }
          },
          error: (error) => console.error('Erro ao carregar trailer:', error)
        });
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do filme:', error);
      }
    });

    this.loadEvaluations(id);

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.authorName = currentUser.name;
    }
  }

  ngOnDestroy(): void {
    this.clearMemory();
  }

  private forceScrollToTop(): void {
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

  private clearMemory(): void {
    this.evaluations = [];
    this.movie = null;
    this.foundMovie = undefined;
    this.linkTrailer = '';
    this.comment = '';
    this.userRating = 5;
    this.isFavorited = false;
  }

  returnSrc(path: string| undefined): string | undefined{
    if(path != null){
      return 'https://image.tmdb.org/t/p/w300' + path ;
    } 
    return
  }

  returnSrcBackDrop(path: string | undefined){
    if(path != null){
      return 'https://image.tmdb.org/t/p/original/' + path ;
    } 
    return
  }

  loadEvaluations(movieId: number): void {
    this.movieDbService.findEvaluations(movieId).subscribe({
      next: (evaluations: any) => {
        this.evaluations = Array.isArray(evaluations) ? evaluations : [];
      },
      error: (error) => {
        console.error('Erro ao carregar avaliações:', error);
        this.evaluations = [];
      }
    });
  }

  checkFavoriteStatus(movieId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.http.get(`http://localhost:8080/api/favorites/check/${currentUser.id}/${movieId}`)
        .subscribe({
          next: (response: any) => {
            this.isFavorited = response.isFavorite;
          },
          error: (error) => {
            console.error('Erro ao verificar status do favorito:', error);
            this.isFavorited = false;
          }
        });
    }
  }

  toggleFavorite(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.movie) return;
    
    this.favoriteLoading = true;
    
    const favoriteData = {
      userId: currentUser.id,
      movieId: this.movie.id
    };

    const endpoint = this.isFavorited ? 
      'http://localhost:8080/api/favorites/remove' : 
      'http://localhost:8080/api/favorites/add';

    this.http.post(endpoint, favoriteData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.isFavorited = !this.isFavorited;
            alert(response.message);
          } else {
            alert(response.message || 'Erro ao alterar favorito');
          }
        },
        error: (error) => {
          console.error('Erro ao alterar favorito:', error);
          alert('Erro ao alterar favorito: ' + (error.error?.message || 'Verifique se o backend está rodando'));
        },
        complete: () => {
          this.favoriteLoading = false;
        }
      });
  }

  canSubmitEvaluation(): boolean {
    return !!(this.authorName && this.comment && this.userRating > 0);
  }

  submitEvaluation(): void {
    if (!this.canSubmitEvaluation()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    
    this.evaluationLoading = true;
    
    const currentUser = this.authService.getCurrentUser();
    const finalAuthorName = this.authorName || currentUser?.name || 'Anônimo';
    
    let movieData: Movie = {
      id: this.foundMovie?.id,
      title: this.movie?.title || '',
      description: this.movie?.overview || '',
      idAPI: this.movie?.id,
      releaseDate: this.movie?.release_date,
      posterUrl: this.movie?.poster_path,
      genre: this.movie?.genres?.[0]?.name
    }
    
    let evaluationData: Evaluation = {
      id: undefined,
      authorName: finalAuthorName,
      score: this.userRating,
      comment: this.comment,
      movie: movieData
    }
    
    this.movieDbService.saveEvaluation(evaluationData).subscribe({
      next: (response: any) => {
        alert('Avaliação salva com sucesso!');
        
        this.comment = '';
        this.userRating = 5;
        
        if (this.movie?.id) {
          this.loadEvaluations(this.movie.id);
        }
      },
      error: (error) => {
        console.error('❌ Erro ao salvar avaliação:', error);
        alert('Erro ao salvar avaliação: ' + (error.error?.message || error.message || 'Erro desconhecido'));
      },
      complete: () => {
        this.evaluationLoading = false;
      }
    });
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  goToHome(): void {
    this.router.navigate(['/home']).then(() => {
      this.forceScrollToTop();
    });
  }

  setRating(rating: number): void {
    this.userRating = Math.min(5, Math.max(1, rating));
  }
}
