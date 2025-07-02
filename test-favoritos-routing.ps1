#!/usr/bin/env pwsh

Write-Host "🎬 TESTE DE ROTEAMENTO - FAVORITOS" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Verificar se o backend está rodando
Write-Host "1. Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/users/login" -Method POST -ContentType "application/json" -Body '{"email":"teste@teste.com","password":"123456"}' -TimeoutSec 5
    Write-Host "✅ Backend está respondendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não está rodando - inicie com: .\start-system.ps1" -ForegroundColor Red
    exit 1
}

# Verificar se o frontend está rodando
Write-Host "2. Verificando frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend está respondendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend não está rodando - inicie com: cd movies-front && ng serve" -ForegroundColor Red
    exit 1
}

# Verificar se os arquivos de routing estão corretos
Write-Host "3. Verificando configuração de rotas..." -ForegroundColor Yellow

$appRoutingFile = "movies-front/src/app/app-routing.module.ts"
if (Test-Path $appRoutingFile) {
    $content = Get-Content $appRoutingFile -Raw
    if ($content -match "canActivate: \[AuthGuard\].*filmes-favoritos") {
        Write-Host "✅ AuthGuard configurado para favoritos" -ForegroundColor Green
    } else {
        Write-Host "❌ AuthGuard não configurado para favoritos" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Arquivo de routing não encontrado" -ForegroundColor Red
}

$favoritosModule = "movies-front/src/app/private/filmes-favoritos/filmes-favoritos.module.ts"
if (Test-Path $favoritosModule) {
    Write-Host "✅ Módulo de favoritos existe" -ForegroundColor Green
} else {
    Write-Host "❌ Módulo de favoritos não encontrado" -ForegroundColor Red
}

$favoritosRouting = "movies-front/src/app/private/filmes-favoritos/filmes-favoritos-routing.module.ts"
if (Test-Path $favoritosRouting) {
    Write-Host "✅ Routing de favoritos existe" -ForegroundColor Green
} else {
    Write-Host "❌ Routing de favoritos não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 INSTRUÇÕES PARA TESTE:" -ForegroundColor Cyan
Write-Host "1. Abra http://localhost:4200" -ForegroundColor White
Write-Host "2. Registre um novo usuário OU faça login com: teste@teste.com / 123456" -ForegroundColor White
Write-Host "3. Clique no botão '❤️ Filmes Favoritos'" -ForegroundColor White
Write-Host "4. Verifique se a página carrega corretamente" -ForegroundColor White
Write-Host "5. Abra o Console do navegador (F12) para ver os logs" -ForegroundColor White
Write-Host ""
Write-Host "🐛 SE O PROBLEMA PERSISTIR:" -ForegroundColor Yellow
Write-Host "- Verifique os logs no console do navegador" -ForegroundColor White
Write-Host "- Procure por mensagens com 🔐 AuthGuard, 🎬 HOME e 🎬 FAVORITOS" -ForegroundColor White
Write-Host "- Verifique se há redirecionamentos não esperados" -ForegroundColor White

Write-Host ""
Write-Host "✅ Script de verificação concluído!" -ForegroundColor Green 