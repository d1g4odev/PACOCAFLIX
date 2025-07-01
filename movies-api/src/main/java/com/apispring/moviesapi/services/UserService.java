package com.apispring.moviesapi.services;

import com.apispring.moviesapi.dto.LoginRequest;
import com.apispring.moviesapi.dto.RegisterRequest;
import com.apispring.moviesapi.dto.UserResponse;
import com.apispring.moviesapi.entities.User;
import com.apispring.moviesapi.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public UserResponse register(RegisterRequest request) throws Exception {
        // Verificar se email já existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email já cadastrado");
        }

        // Criar novo usuário
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Em produção, use hash da senha
        user.setCreatedAt(LocalDateTime.now());

        // Salvar no banco
        User savedUser = userRepository.save(user);

        // Retornar resposta
        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setCreatedAt(savedUser.getCreatedAt());

        return response;
    }

    public UserResponse login(LoginRequest request) throws Exception {
        // Buscar usuário por email
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        
        if (optionalUser.isEmpty()) {
            throw new Exception("Usuário não encontrado");
        }

        User user = optionalUser.get();

        // Verificar senha (em produção, compare com hash)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new Exception("Senha incorreta");
        }

        // Retornar resposta
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
} 