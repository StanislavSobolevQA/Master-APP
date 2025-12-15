@echo off
chcp 65001 >nul
echo ========================================
echo   АВТОМАТИЧЕСКАЯ НАСТРОЙКА ПРОЕКТА
echo ========================================
echo.

echo [ШАГ 1] Создание .env.local...
if exist .env.local (
    echo Файл .env.local уже существует
    choice /C YN /M "Перезаписать"
    if errorlevel 2 goto :skip_env
)

(
    echo # Supabase Configuration
    echo # ВАЖНО: Заполните эти значения данными из вашего проекта Supabase
    echo # Получите их здесь: https://supabase.com/dashboard/project/_/settings/api
    echo.
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
) > .env.local

echo ✓ Файл .env.local создан
echo.
echo ⚠ ВАЖНО: Откройте .env.local и заполните ключи из Supabase!
echo   Settings ^> API ^> Project URL и anon public key
echo.

:skip_env
echo [ШАГ 2] Проверка SQL скрипта...
if exist supabase\schema.sql (
    echo ✓ SQL скрипт найден: supabase/schema.sql
    echo.
    echo ⚠ ВЫПОЛНИТЕ ВРУЧНУЮ:
    echo   1. Откройте https://supabase.com
    echo   2. SQL Editor ^> New query
    echo   3. Скопируйте весь код из supabase/schema.sql
    echo   4. Вставьте и нажмите Run
    echo.
) else (
    echo ✗ SQL скрипт не найден!
)

echo [ШАГ 3] Проверка структуры...
if exist lib\supabase\server.ts (
    echo ✓ lib/supabase/server.ts
) else (
    echo ✗ lib/supabase/server.ts не найден
)

if exist lib\supabase\client.ts (
    echo ✓ lib/supabase/client.ts
) else (
    echo ✗ lib/supabase/client.ts не найден
)

if exist middleware.ts (
    echo ✓ middleware.ts
) else (
    echo ✗ middleware.ts не найден
)

echo.
echo ========================================
echo   ЧТО НУЖНО СДЕЛАТЬ ВРУЧНУЮ:
echo ========================================
echo.
echo 1. Заполните .env.local ключами из Supabase
echo 2. Выполните SQL скрипт в Supabase SQL Editor
echo 3. Настройте Authentication в Supabase:
echo    - Site URL: http://localhost:3000
echo    - Redirect URLs: 
echo      * http://localhost:3000/auth/callback
echo      * http://localhost:3000/dashboard
echo    - Включите Email provider
echo.
echo После этого запустите: npm run dev
echo.
pause

