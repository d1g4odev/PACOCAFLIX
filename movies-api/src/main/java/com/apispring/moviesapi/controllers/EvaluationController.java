package com.apispring.moviesapi.controllers;

import com.apispring.moviesapi.entities.Evaluation;
import com.apispring.moviesapi.entities.Movie;
import com.apispring.moviesapi.services.EvaluationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@Validated
@RestController
@RequestMapping("/evaluation")
public class EvaluationController {
    
    @Autowired
    private EvaluationService evaluationService;

    @CrossOrigin
    @PostMapping("/save")
    public Mono<Evaluation> save(@RequestBody Evaluation evaluation) throws Exception{
        System.out.println("Recebendo avaliação: " + evaluation.toString());
        Evaluation savedEvaluation = this.evaluationService.save(evaluation);
        System.out.println("Avaliação salva: " + savedEvaluation.toString());
        return Mono.just(savedEvaluation);
    }

    @CrossOrigin
    @GetMapping("/findById")
    public Mono<Evaluation> findById(@RequestParam("id") Long id) throws Exception{
        return Mono.just(evaluationService.findById(id));
    }

    @CrossOrigin
    @PostMapping("/update")
    public Mono<Evaluation> update(@RequestBody Evaluation evaluation) throws Exception{
        return Mono.just(evaluationService.update(evaluation));
    }

    @CrossOrigin
    @GetMapping("/findEvaluationsByMovie")
    public Mono<?> findEvaluationsByMovie(@RequestParam("idMovie") Long id) throws Exception{
        return Mono.just(evaluationService.findEvaluationsByMovie(id));
    }

    @CrossOrigin
    @GetMapping("/all")
    public Mono<?> findAllEvaluations() throws Exception{
        return Mono.just(evaluationService.findAll());
    }
}
