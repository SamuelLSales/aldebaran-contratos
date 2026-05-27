@echo off
chcp 65001 > nul
echo ======================================================
echo 🏗️  Aldebaran Contratos - Inicializador Automático
echo ======================================================
echo.

REM Verificar se a pasta backend existe para garantir que estamos na pasta certa
if not exist backend (
    echo [ERRO] Pasta 'backend' não encontrada. Certifique-se de rodar o iniciar.bat a partir da raiz do projeto!
    pause
    exit /b 1
)

echo [1/4] Configurando o Backend (FastAPI)...
cd backend
if not exist venv (
    echo Criando ambiente virtual Python (venv)...
    python -m venv venv
)
echo Ativando ambiente virtual e instalando dependências...
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo [2/4] Configurando o Frontend (React)...
cd frontend
echo Instalando dependências do Node.js (isso pode levar alguns instantes)...
call npm install
cd ..

echo.
echo [3/4] Iniciando Servidor Backend (FastAPI) em uma nova janela...
start "Aldebaran - Backend" cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo [4/4] Iniciando Servidor Frontend (React + Vite) em uma nova janela...
start "Aldebaran - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================
echo 🎉 Configuração e Inicialização concluída com sucesso!
echo ======================================================
echo.
echo Servidor Backend:  http://localhost:8000
echo Servidor Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar esta janela de configuração.
echo As janelas secundárias contendo os servidores devem permanecer abertas!
echo.
pause
