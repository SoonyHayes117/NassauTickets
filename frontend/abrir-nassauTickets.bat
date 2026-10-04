@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Iniciando o nassauTickets...
echo.

if not exist "node_modules" (
    echo Primeira vez rodando aqui, instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo.
        echo Ocorreu um erro no npm install. Copie a mensagem acima e mande para o Claude.
        pause
        exit /b
    )
)

start "" http://localhost:5173
call npm run dev

pause
