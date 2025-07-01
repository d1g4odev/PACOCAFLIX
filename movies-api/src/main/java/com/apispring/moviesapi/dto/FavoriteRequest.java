package com.apispring.moviesapi.dto;

import com.apispring.moviesapi.entities.Movie;
import lombok.Data;

@Data
public class FavoriteRequest {
    private Long userId;
    private Long movieId;
    private Movie movieData;
} 