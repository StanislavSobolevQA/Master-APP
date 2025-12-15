@echo off
chcp 65001 >nul
echo Запуск приложения...
echo.
echo Приложение будет доступно по адресу: http://localhost:3000
echo.
echo Для остановки нажмите Ctrl+C
echo.
call npm run dev

