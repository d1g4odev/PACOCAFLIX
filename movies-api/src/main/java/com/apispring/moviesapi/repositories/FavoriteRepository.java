package com.apispring.moviesapi.repositories;

import com.apispring.moviesapi.entities.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    // Buscar todos os favoritos de um usuário (query SQL nativa)
    @Query(value = "SELECT * FROM favorites WHERE user_id = :userId ORDER BY created_at DESC", nativeQuery = true)
    List<Favorite> findFavoritesByUserId(@Param("userId") Long userId);
    
    // Verificar se um filme está nos favoritos de um usuário
    @Query(value = "SELECT COUNT(*) > 0 FROM favorites f JOIN movie m ON f.movie_id = m.id WHERE f.user_id = :userId AND m.id_api = :movieId", nativeQuery = true)
    boolean existsByUserIdAndMovieIdAPI(@Param("userId") Long userId, @Param("movieId") Long movieId);
    
    // Deletar favorito por usuário e filme
    @Modifying
    @Query(value = "DELETE FROM favorites WHERE user_id = :userId AND movie_id IN (SELECT id FROM movie WHERE id_api = :movieId)", nativeQuery = true)
    void deleteByUserIdAndMovieIdAPI(@Param("userId") Long userId, @Param("movieId") Long movieId);
    
    // Contar quantos favoritos um usuário tem
    @Query(value = "SELECT COUNT(*) FROM favorites WHERE user_id = :userId", nativeQuery = true)
    long countByUserId(@Param("userId") Long userId);
} 