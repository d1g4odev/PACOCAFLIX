package com.apispring.moviesapi.repositories;

import com.apispring.moviesapi.entities.Favorite;
import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUser(User user);
    
    List<Favorite> findByUserId(Long userId);
    
    Optional<Favorite> findByUserAndMovie(User user, Movie movie);
    
    Optional<Favorite> findByUserIdAndMovieId(Long userId, Long movieId);
    
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
    
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
} 