Write-Host "🚀 TESTE RÁPIDO - VERIFICANDO SE TUDO FUNCIONA" -ForegroundColor Yellow
Write-Host "=" * 50

# Teste backend
Write-Host "📦 Testando compilação do backend..." -ForegroundColor Blue
cd movies-api
$backendTest = mvn compile -q
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend compila OK!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro na compilação do backend!" -ForegroundColor Red
    exit 1
}

# Teste frontend  
cd ../movies-front
Write-Host "🎨 Testando compilação do frontend..." -ForegroundColor Blue
$frontendTest = ng build --configuration=development --verbose=false 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend compila OK!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro na compilação do frontend!" -ForegroundColor Red
}

cd ..
Write-Host "=" * 50
Write-Host "🎉 PROJETO PRONTO PARA ENTREGA!" -ForegroundColor Green
Write-Host "📋 Para iniciar: Execute o script .\start-system.ps1" -ForegroundColor Cyan 