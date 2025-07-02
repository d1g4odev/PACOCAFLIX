# Script para inicializar o sistema CINEAPP (Frontend + Backend)
Write-Host "🎬 Iniciando CINEAPP - Sistema de Filmes" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Verificar se Java está disponível
Write-Host "📋 Verificando Java..." -ForegroundColor Yellow
try {
    java -version | Out-Null
    Write-Host "✅ Java está disponível" -ForegroundColor Green
} catch {
    Write-Host "❌ Java não está instalado. Por favor, instale Java 11+ e tente novamente." -ForegroundColor Red
    exit 1
}

# Verificar se Node.js está disponível
Write-Host "📋 Verificando Node.js..." -ForegroundColor Yellow
try {
    node --version | Out-Null
    Write-Host "✅ Node.js está disponível" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não está instalado. Por favor, instale Node.js e tente novamente." -ForegroundColor Red
    exit 1
}

Write-Host "🗄️ Usando banco H2 em arquivo (não precisa de Docker/PostgreSQL)" -ForegroundColor Green
Write-Host "🔗 Console H2 disponível em: http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host "   JDBC URL: jdbc:h2:file:./data/movies-api" -ForegroundColor Gray
Write-Host "   Username: sa | Password: password" -ForegroundColor Gray

# Compilar e iniciar backend
Write-Host "🔧 Compilando backend..." -ForegroundColor Yellow
Set-Location "movies-api"
mvn clean compile
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend compilado com sucesso" -ForegroundColor Green
    
    # Iniciar backend em background
    Write-Host "🚀 Iniciando backend na porta 8080..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-Command", "mvn spring-boot:run" -WindowStyle Minimized
    Start-Sleep -Seconds 5
} else {
    Write-Host "❌ Erro ao compilar backend" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

# Iniciar frontend
Write-Host "🌐 Iniciando frontend..." -ForegroundColor Yellow
Set-Location "movies-front"

Write-Host "🚀 Iniciando frontend na porta 4200..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Minimized

Set-Location ".."

Write-Host "" -ForegroundColor Green
Write-Host "🎉 Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "📊 Swagger:  http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host "🗄️ H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host "   └─ URL: jdbc:h2:mem:moviesdb" -ForegroundColor Yellow
Write-Host "   └─ User: sa / Password: password" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Green
Write-Host "Para parar o sistema, use: ./stop-system.ps1" -ForegroundColor Yellow

# Aguardar um pouco e abrir navegador
Start-Sleep -Seconds 10
Write-Host "🌍 Abrindo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:4200" 