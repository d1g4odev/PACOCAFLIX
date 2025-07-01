package com.apispring.moviesapi.services;

import java.util.List;
import java.util.ArrayList;

import com.apispring.moviesapi.entities.Evaluation;
import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.repositories.EvaluationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvaluationService {
    
    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private MovieService movieService;

    @Transactional
    public Evaluation findById(Long id) throws Exception{
        return this.evaluationRepository.findById(id)
            .orElseThrow(() -> new Exception("Avaliação não encontrada"));
    }

    @Transactional
    public Evaluation save(Evaluation evaluation) throws Exception {
        Movie movieToUse = null;
        
        if (evaluation.getMovie() != null && evaluation.getMovie().getIdAPI() != null) {
            movieToUse = movieService.findByIdAPI(evaluation.getMovie().getIdAPI());
            
            if (movieToUse == null) {
                movieToUse = new Movie();
                movieToUse.setIdAPI(evaluation.getMovie().getIdAPI());
                movieToUse.setTitle(evaluation.getMovie().getTitle());
                movieToUse.setDescription(evaluation.getMovie().getDescription());
                movieToUse = movieService.save(movieToUse);
            }
        } else {
            throw new Exception("ID da API TMDB do filme é obrigatório");
        }
        
        evaluation.setMovie(movieToUse);
        
        if (evaluation.getScore() == null || evaluation.getScore() < 1 || evaluation.getScore() > 5) {
            throw new Exception("Score deve estar entre 1 e 5");
        }
        
        if (evaluation.getAuthorName() == null || evaluation.getAuthorName().trim().isEmpty()) {
            evaluation.setAuthorName("Anônimo");
        }
       
        Evaluation savedEvaluation = this.evaluationRepository.saveAndFlush(evaluation);
        
        return savedEvaluation;
    }

    @Transactional
    public Evaluation update(Evaluation evaluation) throws Exception{
        return this.save(evaluation);
    }

    @Transactional
    public List<Evaluation> findEvaluationsByMovie(Long idMovie) throws Exception {
        Movie movie = movieService.findByIdAPI(idMovie);
        if (movie == null) {
            return new ArrayList<>();
        }
        return this.evaluationRepository.findByMovie(movie);
    }

    @Transactional(readOnly = true)
    public List<Evaluation> findAll() {
        return this.evaluationRepository.findAll();
    }
}
