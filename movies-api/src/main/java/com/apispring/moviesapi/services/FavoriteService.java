package com.apispring.moviesapi.services;

import com.apispring.moviesapi.entities.Favorite;
import com.apispring.moviesapi.entities.User;
import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.repositories.FavoriteRepository;
import com.apispring.moviesapi.repositories.UserRepository;
import com.apispring.moviesapi.repositories.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    // Adicionar filme aos favoritos
    public Favorite addToFavorites(Long userId, Long movieId) {
        // Verificar se já existe
        if (favoriteRepository.existsByUserIdAndMovieIdAPI(userId, movieId)) {
            throw new RuntimeException("Filme já está nos favoritos do usuário");
        }
        
        // Buscar ou criar usuário
        User user = userRepository.findById(userId).orElseGet(() -> {
            User newUser = new User();
            newUser.setId(userId);
            newUser.setName("user" + userId);
            newUser.setEmail("user" + userId + "@example.com");
            newUser.setPassword("password"); // senha padrão
            return userRepository.save(newUser);
        });
        
        // Buscar ou criar filme (buscar por idAPI para evitar conflitos)
        List<Movie> existingMovies = movieRepository.findByIdAPI(movieId);
        Movie movie;
        
        if (!existingMovies.isEmpty()) {
            movie = existingMovies.get(0); // Usar o primeiro filme encontrado
        } else {
            Movie newMovie = new Movie();
            // Não definir ID manualmente, deixar auto-increment
            newMovie.setTitle("Filme " + movieId);
            newMovie.setDescription("Filme importado automaticamente do sistema de favoritos");
            newMovie.setIdAPI(movieId);
            newMovie.setReleaseDate("2024-01-01"); // Data padrão
            newMovie.setPosterUrl("/default-poster.jpg"); // URL padrão
            newMovie.setGenre("Ação"); // Gênero padrão
            movie = movieRepository.save(newMovie);
        }
        
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setMovie(movie);
        
        return favoriteRepository.save(favorite);
    }
    
    // Remover filme dos favoritos
    @Transactional
    public boolean removeFromFavorites(Long userId, Long movieId) {
        if (favoriteRepository.existsByUserIdAndMovieIdAPI(userId, movieId)) {
            favoriteRepository.deleteByUserIdAndMovieIdAPI(userId, movieId);
            return true;
        }
        return false;
    }
    
    // Toggle favorito (adicionar se não existe, remover se existe)
    public Object toggleFavorite(Long userId, Long movieId) {
        if (favoriteRepository.existsByUserIdAndMovieIdAPI(userId, movieId)) {
            removeFromFavorites(userId, movieId);
            return new Object() {
                public boolean isFavorite = false;
                public String message = "Filme removido dos favoritos";
            };
        } else {
            addToFavorites(userId, movieId);
            return new Object() {
                public boolean isFavorite = true;
                public String message = "Filme adicionado aos favoritos";
            };
        }
    }
    
    // Verificar se filme está nos favoritos
    public boolean isFavorite(Long userId, Long movieId) {
        return favoriteRepository.existsByUserIdAndMovieIdAPI(userId, movieId);
    }
    
    // Listar todos os favoritos de um usuário
    public List<Favorite> getUserFavorites(Long userId) {
        try {
            // Verificar se o usuário existe antes de buscar favoritos
            if (!userRepository.existsById(userId)) {
                return new ArrayList<>(); // Retorna lista vazia se usuário não existe
            }
            
            // Usar query SQL nativa que sempre funciona
            return favoriteRepository.findFavoritesByUserId(userId);
        } catch (Exception e) {
            // Em caso de erro, retorna lista vazia
            return new ArrayList<>();
        }
    }
    
    // Contar favoritos do usuário
    public long countUserFavorites(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }
} 