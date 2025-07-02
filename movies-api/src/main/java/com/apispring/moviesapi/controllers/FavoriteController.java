package com.apispring.moviesapi.controllers;

import com.apispring.moviesapi.entities.Favorite;
import com.apispring.moviesapi.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;
    
    // Adicionar filme aos favoritos
    @PostMapping("/favorites/add")
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long movieId = Long.valueOf(request.get("movieId").toString());
            
            Favorite favorite = favoriteService.addToFavorites(userId, movieId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Filme adicionado aos favoritos!",
                "favorite", favorite
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Remover filme dos favoritos
    @PostMapping("/favorites/remove")
    public ResponseEntity<?> removeFavorite(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long movieId = Long.valueOf(request.get("movieId").toString());
            
            boolean removed = favoriteService.removeFromFavorites(userId, movieId);
            if (removed) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Filme removido dos favoritos!"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Filme não estava nos favoritos"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Toggle favorito (adicionar/remover)
    @PostMapping("/favorites/toggle")
    public ResponseEntity<?> toggleFavorite(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long movieId = request.get("movieId");
            
            Object result = favoriteService.toggleFavorite(userId, movieId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    // Listar favoritos de um usuário (versão simples)
    @GetMapping("/favorites/user/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable Long userId) {
        try {
            // Por enquanto, retornar apenas uma lista simples dos favoritos
            List<Map<String, Object>> favorites = new ArrayList<>();
            
            // Buscar favoritos manualmente
            List<Favorite> rawFavorites = favoriteService.getUserFavorites(userId);
            for (Favorite fav : rawFavorites) {
                Map<String, Object> favoriteData = new HashMap<>();
                favoriteData.put("id", fav.getId());
                favoriteData.put("createdAt", fav.getCreatedAt());
                
                if (fav.getMovie() != null) {
                    Map<String, Object> movieData = new HashMap<>();
                    movieData.put("id", fav.getMovie().getId());
                    movieData.put("title", fav.getMovie().getTitle());
                    movieData.put("idAPI", fav.getMovie().getIdAPI());
                    movieData.put("description", fav.getMovie().getDescription());
                    favoriteData.put("movie", movieData);
                }
                
                favorites.add(favoriteData);
            }
            
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Erro ao buscar favoritos: " + e.getMessage(),
                "error", e.getClass().getSimpleName()
            ));
        }
    }
    
    // Verificar se filme está nos favoritos
    @GetMapping("/favorites/check/{userId}/{movieId}")
    public ResponseEntity<?> checkIfFavorite(@PathVariable Long userId, @PathVariable Long movieId) {
        try {
            boolean isFavorite = favoriteService.isFavorite(userId, movieId);
            return ResponseEntity.ok(Map.of(
                "isFavorite", isFavorite,
                "userId", userId,
                "movieId", movieId
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "isFavorite", false,
                "userId", userId,
                "movieId", movieId,
                "error", e.getMessage()
            ));
        }
    }
    
    // Contar favoritos do usuário
    @GetMapping("/favorites/count/{userId}")
    public ResponseEntity<?> countUserFavorites(@PathVariable Long userId) {
        long count = favoriteService.countUserFavorites(userId);
        return ResponseEntity.ok(Map.of(
            "userId", userId,
            "favoritesCount", count
        ));
    }
} 