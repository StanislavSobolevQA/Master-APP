@echo off
chcp 65001 >nul
echo ========================================
echo   СОЗДАНИЕ .env.local
echo ========================================
echo.

if exist .env.local (
    echo ⚠ Файл .env.local уже существует!
    echo.
    choice /C YN /M "Перезаписать существующий файл"
    if errorlevel 2 goto :end
    echo.
)

echo Создание .env.local из шаблона...
(
    echo # Supabase Configuration
    echo # Заполните эти значения данными из вашего проекта Supabase
    echo.
    echo # Project URL из панели Supabase ^(Settings ^> API ^> Project URL^)
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    echo.
    echo # Anon Key из панели Supabase ^(Settings ^> API ^> anon public^)
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    echo.
    echo # Site URL для редиректов после авторизации
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
) > .env.local

echo ✓ Файл .env.local создан!
echo.
echo ⚠ ВАЖНО: Откройте .env.local и заполните:
echo   1. NEXT_PUBLIC_SUPABASE_URL - ваш Project URL
echo   2. NEXT_PUBLIC_SUPABASE_ANON_KEY - ваш anon key
echo.
echo Где найти ключи:
echo   - Откройте https://supabase.com
echo   - Войдите в ваш проект
echo   - Settings ^> API
echo   - Скопируйте Project URL и anon public key
echo.
echo После заполнения сохраните файл и продолжайте настройку.
echo.

:end
pause

