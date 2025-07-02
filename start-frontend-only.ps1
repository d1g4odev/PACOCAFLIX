Write-Host "🎬 Iniciando Frontend com API Externa TMDB" -ForegroundColor Yellow
Write-Host "=" * 50

# Navegar para o frontend
Set-Location movies-front

Write-Host "📦 Instalando dependências..." -ForegroundColor Blue
npm install

Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend será executado em: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔑 Usando API TMDB externa (não precisa do backend local)" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Funcionalidades disponíveis:" -ForegroundColor White
Write-Host "  🔥 Filmes populares da TMDB" -ForegroundColor Gray
Write-Host "  🎭 Filmes em cartaz" -ForegroundColor Gray  
Write-Host "  🔍 Busca por título" -ForegroundColor Gray
Write-Host "  📋 Detalhes dos filmes" -ForegroundColor Gray
Write-Host ""
Write-Host "⏹️ Para parar: Ctrl+C" -ForegroundColor Yellow
Write-Host "=" * 50

npm start 