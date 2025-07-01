package com.apispring.moviesapi.repositories;

import java.util.List;

import com.apispring.moviesapi.entities.Evaluation;
import com.apispring.moviesapi.entities.Movie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByMovie(Movie movie);
}
