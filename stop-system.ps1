# Script para parar o sistema CINEAPP
Write-Host "🛑 Parando CINEAPP..." -ForegroundColor Red

# Parar processos Node.js (Angular)
Write-Host "🌐 Parando frontend..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Parar processos Java (Spring Boot)
Write-Host "🔧 Parando backend..." -ForegroundColor Yellow
Get-Process java -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*spring-boot*" -or $_.ProcessName -eq "java" } | Stop-Process -Force

# H2 é em memória, não precisa parar
Write-Host "🗄️ Banco H2 em memória será finalizado automaticamente" -ForegroundColor Yellow

Write-Host "✅ Sistema parado com sucesso!" -ForegroundColor Green 