@echo off
echo.
echo ============================================
echo   Generation des creneaux horaires
echo ============================================
echo.
echo Assurez-vous que le serveur Next.js tourne sur le port 3000
echo (dans un autre terminal: npm run dev)
echo.
pause
echo.
echo Lancement de la generation...
echo.
node scripts/generate-slots.js
echo.
echo ============================================
echo   Generation terminee!
echo ============================================
echo.
pause
