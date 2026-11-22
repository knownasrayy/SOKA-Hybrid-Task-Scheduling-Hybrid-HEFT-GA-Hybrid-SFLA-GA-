@echo off
cd /d "%~dp0"
title HybridLab 3D - ITS SOKA Presentation
echo ========================================================
echo   HYBRIDLAB 3D - TEKNOLOGI INFORMASI ITS (SOKA)
echo ========================================================
echo   Menjalankan server lokal di http://localhost:3000...
echo   Browser akan terbuka otomatis saat server siap...
echo ========================================================
node ./node_modules/vite/bin/vite.js --host localhost --port 3000 --open
pause
