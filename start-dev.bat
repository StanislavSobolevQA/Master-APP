@echo off
chcp 65001 >nul
echo ========================================
echo  Запуск приложения "Рядом"
echo ========================================
echo.
echo Проверка зависимостей...
if not exist "node_modules" (
    echo Зависимости не установлены. Запускаю установку...
    call npm install
    if errorlevel 1 (
        echo.
        echo ОШИБКА: Не удалось установить зависимости
        pause
        exit /b 1
    )
)
echo.
echo Запуск dev сервера...
echo.
echo Приложение будет доступно по адресу: http://localhost:3000
echo.
echo Для остановки нажмите Ctrl+C
echo.
call npm run dev

