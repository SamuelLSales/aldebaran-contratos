@echo off
title Sistema Aldebaran Contratos
chcp 65001 >nul
echo ===================================================
echo       INICIANDO SISTEMA ALDEBARAN CONTRATOS
echo ===================================================
echo.

cd /d "%~dp0"

echo Encerrando instancias antigas nas portas 3000 e 8000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000,8000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo [1/2] Iniciando Servidor Backend (FastAPI na porta 8000)...
start "Aldebaran - Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && call venv\Scripts\activate.bat && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Iniciando Servidor Frontend (React na porta 3000)...
start "Aldebaran - Frontend (Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ===================================================
echo  Servidores em execucao!
echo  URL: http://localhost:3000
echo  Login padrao: admin / admin
echo ===================================================
timeout /t 3 >nul
start http://localhost:3000
