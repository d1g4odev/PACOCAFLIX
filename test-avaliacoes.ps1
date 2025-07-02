#!/usr/bin/env pwsh

Write-Host "🎬 TESTE DO SISTEMA DE AVALIAÇÕES - PAÇOCAFLIX" -ForegroundColor Cyan
Write-Host "=" * 50

# Verificar se os serviços estão rodando
Write-Host "`n🔍 Verificando serviços..." -ForegroundColor Yellow

# Testar backend
try {
    $backendTest = Invoke-RestMethod -Uri "http://localhost:8080/evaluation/all" -Method GET
    Write-Host "✅ Backend funcionando - " -ForegroundColor Green -NoNewline
    Write-Host "$($backendTest.Count) avaliações no banco" -ForegroundColor White
} catch {
    Write-Host "❌ Backend não está funcionando na porta 8080" -ForegroundColor Red
    Write-Host "Execute: cd movies-api; mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# Testar frontend
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend funcionando na porta 4200" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend não está funcionando na porta 4200" -ForegroundColor Red
    Write-Host "Execute: cd movies-front; npm start" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📊 DADOS DO BANCO H2:" -ForegroundColor Cyan
Write-Host "🔗 URL: http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "🔑 JDBC URL: jdbc:h2:file:./data/movies-api" -ForegroundColor White
Write-Host "👤 User: sa" -ForegroundColor White
Write-Host "🔒 Password: password" -ForegroundColor White

Write-Host "`n📝 AVALIAÇÕES EXISTENTES:" -ForegroundColor Cyan
if ($backendTest.Count -gt 0) {
    foreach ($eval in $backendTest) {
        Write-Host "• ID: $($eval.id) | Autor: $($eval.authorName) | Score: $($eval.score) | Filme: $($eval.movie.title)" -ForegroundColor White
    }
} else {
    Write-Host "• Nenhuma avaliação encontrada" -ForegroundColor Yellow
}

Write-Host "`n🎯 COMO TESTAR:" -ForegroundColor Cyan
Write-Host "1. Acesse: http://localhost:4200" -ForegroundColor White
Write-Host "2. Faça login ou cadastre-se" -ForegroundColor White
Write-Host "3. Clique em qualquer filme para ver detalhes" -ForegroundColor White
Write-Host "4. Preencha uma avaliação com seu nome" -ForegroundColor White
Write-Host "5. Clique no botão '🔍 Debug Avaliações' para ver logs" -ForegroundColor White
Write-Host "6. Verifique o console do navegador (F12)" -ForegroundColor White

Write-Host "`n🚀 Sistema pronto para teste!" -ForegroundColor Green 