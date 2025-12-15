@echo off
chcp 65001 >nul
echo Открываю браузер...
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo.
echo Браузер должен открыться автоматически.
echo Если нет, откройте вручную: http://localhost:3000
echo.
pause

