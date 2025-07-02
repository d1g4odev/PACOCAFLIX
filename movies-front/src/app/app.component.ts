import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'movies-front';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Monitorar todas as navegações para debug
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('🚀 App: Navegação iniciando para:', event.url);
      }
      if (event instanceof NavigationEnd) {
        console.log('✅ App: Navegação finalizada:', event.url);
        console.log('🔄 App: URL anterior:', event.urlAfterRedirects);
      }
    });
    
    // Garantir que todas as rotas sempre iniciem no topo
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log('📍 App: Aplicando scroll to top');
        this.forceScrollToTop();
      });
  }

  // Método robusto para forçar scroll to top
  private forceScrollToTop(): void {
    // Scroll imediato
    window.scrollTo(0, 0);
    
    // Backup 1: após renderização do DOM
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
    
    // Backup 2: força scroll se ainda não funcionou
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 50);
    
    // Backup 3: última tentativa
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 200);
  }
}
