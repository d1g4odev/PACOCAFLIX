package com.apispring.moviesapi.controllers;

import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.services.MovieService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import reactor.core.publisher.Mono;

@Validated
@RestController
@RequestMapping("/movie")
public class MovieController {
    
    @Autowired
    private MovieService movieService;

    private final String apiKey = "e5773530e7e66ca9984fa59dd68db15f";
    private final String tmdbUrl = "https://api.themoviedb.org/3";
    private final RestTemplate restTemplate = new RestTemplate();

    @CrossOrigin
    @PostMapping("/save")
    public Mono<Movie> save(@RequestBody Movie movie){
        return Mono.just(this.movieService.save(movie));
    }

    @CrossOrigin
    @GetMapping("/findById")
    public Mono<Movie> findById(@RequestParam("id") Long id) throws Exception{
        return Mono.just(this.movieService.getById(id));
    }

    @CrossOrigin
    @PostMapping("/update")
    public Mono<Movie> update(@RequestBody Movie movie){
        return Mono.just(this.movieService.save(movie));
    }

    @CrossOrigin
    @GetMapping("/findByIdApi")
    public Mono<?> findByIdApi(@RequestParam("id") Long id) throws Exception{
        return Mono.just(this.movieService.findByIdAPI(id));
    }

    // ENDPOINTS OBRIGATÓRIOS ADICIONADOS

    @CrossOrigin
    @GetMapping("/list")
    public Mono<?> listAllMovies() {
        return Mono.just(this.movieService.findAll());
    }

    @CrossOrigin
    @GetMapping("/genre/{genreId}")
    public Mono<?> findMoviesByGenre(@PathVariable("genreId") Long genreId) {
        return Mono.just(this.movieService.findByGenre(genreId));
    }

    @CrossOrigin
    @GetMapping("/by-genre")
    public Mono<?> findMoviesByGenreName(@RequestParam("genre") String genreName) {
        return Mono.just(this.movieService.findByGenreName(genreName));
    }

    @CrossOrigin
    @GetMapping("/genres")
    public Mono<?> listAllGenres() {
        return Mono.just(this.movieService.findAllGenres());
    }

    @GetMapping("/movies/popular")
    public String getPopularMovies() {
        String url = tmdbUrl + "/movie/popular?api_key=" + apiKey;
        return restTemplate.getForObject(url, String.class);
    }

    @GetMapping("/movies/{id}")
    public String getMovieDetails(@PathVariable String id) {
        String url = tmdbUrl + "/movie/" + id + "?api_key=" + apiKey;
        return restTemplate.getForObject(url, String.class);
    }

    @GetMapping("/movies/genre")
    public String getMoviesByGenre(@RequestParam String genreId) {
        String url = tmdbUrl + "/discover/movie?api_key=" + apiKey + "&with_genres=" + genreId;
        return restTemplate.getForObject(url, String.class);
    }
}
