# Script pour démarrer le serveur de développement avec Stripe webhook
# Lance automatiquement Next.js et le webhook Stripe en parallèle

Write-Host "Demarrage du serveur de developpement T&T..." -ForegroundColor Green
Write-Host ""

# Ajouter Stripe CLI au PATH
$env:PATH += ";$env:USERPROFILE\stripe-cli"

# Vérifier que Stripe CLI est installé
if (-not (Get-Command stripe -ErrorAction SilentlyContinue)) {
    Write-Host " Stripe CLI n'est pas trouvé dans le PATH" -ForegroundColor Red
    Write-Host "Assurez-vous que Stripe CLI est installe dans $env:USERPROFILE\stripe-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "Stripe CLI detecte" -ForegroundColor Green

# Lancer les deux processus en parallèle
Write-Host ""
Write-Host " Lancement du webhook Stripe..." -ForegroundColor Cyan
Write-Host " Lancement de Next.js..." -ForegroundColor Cyan
Write-Host ""
Write-Host " Les deux services vont demarrer. Appuyez sur Ctrl+C pour tout arreter." -ForegroundColor Yellow
Write-Host ""

# Lancer Stripe listen en arrière-plan
$stripeJob = Start-Job -ScriptBlock {
    $env:PATH += ";$env:USERPROFILE\stripe-cli"
    Set-Location $using:PWD
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
}

# Attendre un peu que Stripe démarre
Start-Sleep -Seconds 2

# Lancer npm run dev en avant-plan
try {
    npm run dev
} finally {
    # Arrêter le job Stripe quand npm s'arrête
    Write-Host ""
    Write-Host "Arret du webhook Stripe..." -ForegroundColor Yellow
    Stop-Job $stripeJob
    Remove-Job $stripeJob
    Write-Host " Termine" -ForegroundColor Green
}
