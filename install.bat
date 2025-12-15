@echo off
chcp 65001 >nul
echo Установка зависимостей...
call npm install
if %errorlevel% equ 0 (
    echo.
    echo ✓ Зависимости установлены успешно!
    echo.
    echo Теперь запустите start.bat для запуска приложения
) else (
    echo.
    echo ✗ Ошибка при установке зависимостей
    pause
)

