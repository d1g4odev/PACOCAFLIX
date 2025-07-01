package com.apispring.moviesapi.services;

import java.util.List;

import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.entities.Genre;
import com.apispring.moviesapi.repositories.MovieRepository;
import com.apispring.moviesapi.repositories.GenreRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private GenreRepository genreRepository;

    @Transactional
    public Movie getById(Long id) throws Exception{
        return this.movieRepository.findById(id)
            .orElseThrow( () -> new Exception("Filme não encontrado"));
    }

    @Transactional
    public Movie save(Movie movie){
        return this.movieRepository.saveAndFlush(movie);
    }

    @Transactional
    public Movie update(Movie movie){
        return this.movieRepository.save(movie);
    }

    @Transactional(readOnly = true)
    public Movie findByIdAPI(Long idAPI) {
        return movieRepository.findByIdAPI(idAPI).stream().findFirst().orElse(null);
    }

    @Transactional
    public Movie findOrCreateByTmdbId(Long tmdbId, String title) {
        Movie existingMovie = this.findByIdAPI(tmdbId);
        
        if (existingMovie != null) {
            return existingMovie;
        } else {
            // Criar novo filme
            Movie newMovie = new Movie();
            newMovie.setIdAPI(tmdbId);
            newMovie.setTitle(title != null ? title : "Filme da API");
            return this.movieRepository.saveAndFlush(newMovie);
        }
    }

    // MÉTODOS OBRIGATÓRIOS ADICIONADOS

    @Transactional(readOnly = true)
    public List<Movie> findAll() {
        return this.movieRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Movie> findByGenre(Long genreId) {
        // Como o campo genre na Movie é String, vamos buscar pelo nome do gênero
        Genre genre = this.genreRepository.findById(genreId).orElse(null);
        if (genre != null) {
            return this.movieRepository.findByGenreContainingIgnoreCase(genre.getName());
        }
        return List.of();
    }

    @Transactional(readOnly = true)
    public List<Genre> findAllGenres() {
        return this.genreRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Movie> findByGenreName(String genreName) {
        return this.movieRepository.findByGenreContainingIgnoreCase(genreName);
    }
    
}
