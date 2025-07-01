package com.apispring.moviesapi.controllers;

import com.apispring.moviesapi.dto.FavoriteRequest;
import com.apispring.moviesapi.entities.Favorite;
import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.services.FavoriteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;

    @CrossOrigin
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@RequestBody FavoriteRequest request) {
        try {
            Favorite favorite = favoriteService.toggleFavorite(request.getUserId(), request.getMovieId(), request.getMovieData());
            
            Map<String, Object> response = new HashMap<>();
            response.put("isFavorite", favorite != null);
            response.put("message", favorite != null ? "Adicionado aos favoritos" : "Removido dos favoritos");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @CrossOrigin
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addFavorite(@RequestBody FavoriteRequest request) {
        try {
            Favorite favorite = favoriteService.addFavorite(request.getUserId(), request.getMovieId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("favorite", favorite);
            response.put("message", "Adicionado aos favoritos com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @CrossOrigin
    @PostMapping("/remove")
    public ResponseEntity<Map<String, Object>> removeFavorite(@RequestBody FavoriteRequest request) {
        try {
            // Primeiro tentar buscar o filme pelo ID da API TMDB se for necessário
            Movie movie = favoriteService.findMovieByIdOrAPI(request.getMovieId());
            Long movieIdToUse = movie != null ? movie.getId() : request.getMovieId();
            
            favoriteService.removeFavorite(request.getUserId(), movieIdToUse);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Removido dos favoritos com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @CrossOrigin
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable Long userId) {
        List<Favorite> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @CrossOrigin
    @GetMapping("/check/{userId}/{movieId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Long userId, @PathVariable Long movieId) {
        boolean isFavorite = favoriteService.isFavorite(userId, movieId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFavorite", isFavorite);
        
        return ResponseEntity.ok(response);
    }
} 