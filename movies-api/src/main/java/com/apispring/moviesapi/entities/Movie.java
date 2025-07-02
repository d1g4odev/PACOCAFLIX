package com.apispring.moviesapi.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "movie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(setterPrefix = "set")
public class Movie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description" , columnDefinition = "TEXT")
    private String description;

    @Column(name = "id_api", unique = true)
    private Long idAPI;

    @Column(name = "release_date")
    private String releaseDate;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "genre")
    private String genre; 

}
