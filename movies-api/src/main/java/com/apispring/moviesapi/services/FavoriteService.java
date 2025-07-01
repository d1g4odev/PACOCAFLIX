package com.apispring.moviesapi.services;

import com.apispring.moviesapi.entities.Favorite;
import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.entities.User;
import com.apispring.moviesapi.repositories.FavoriteRepository;
import com.apispring.moviesapi.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MovieService movieService;

    @Transactional
    public Favorite addFavorite(Long userId, Long movieId) throws Exception {
        // Verificar se já está nos favoritos
        if (favoriteRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new Exception("Filme já está nos favoritos");
        }

        // Buscar usuário
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("Usuário não encontrado"));

        // Buscar ou criar filme
        Movie movie = movieService.getById(movieId);
        if (movie == null) {
            // Se não existe, criar um registro básico
            movie = new Movie();
            movie.setIdAPI(movieId);
            movie.setTitle("Filme da API");
            movie = movieService.save(movie);
        }

        // Criar favorito
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setMovie(movie);

        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long movieId) throws Exception {
        if (!favoriteRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new Exception("Filme não está nos favoritos");
        }
        
        favoriteRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    @Transactional(readOnly = true)
    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long movieId) {
        return favoriteRepository.existsByUserIdAndMovieId(userId, movieId);
    }

    @Transactional(readOnly = true)
    public Movie findMovieByIdOrAPI(Long movieId) {
        // Primeiro tentar buscar pelo ID local
        try {
            Movie movie = movieService.getById(movieId);
            if (movie != null) {
                return movie;
            }
        } catch (Exception e) {
            // Se não encontrar pelo ID local, tentar pelo ID da API
        }
        
        // Tentar buscar pelo ID da API TMDB
        return movieService.findByIdAPI(movieId);
    }

    @Transactional
    public Favorite toggleFavorite(Long userId, Long movieId, Movie movieData) throws Exception {
        // Primeiro buscar o filme pelo ID da API TMDB
        Movie movie = movieService.findByIdAPI(movieId);
        
        // Se não existir, criar um novo registro com os dados enviados
        if (movie == null) {
            movie = new Movie();
            movie.setIdAPI(movieId);
            movie.setTitle(movieData != null ? movieData.getTitle() : "Filme " + movieId);
            movie.setDescription(movieData != null ? movieData.getDescription() : "");
            movie = movieService.save(movie);
        }
        
        // Agora verificar se já é favorito usando o ID do banco local
        if (isFavorite(userId, movie.getId())) {
            removeFavorite(userId, movie.getId());
            return null; // Removido
        } else {
            return addFavorite(userId, movie.getId()); // Adicionado
        }
    }
} 