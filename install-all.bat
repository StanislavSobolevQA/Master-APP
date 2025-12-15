@echo off
chcp 65001 >nul
echo ========================================
echo   ПОЛНАЯ УСТАНОВКА ПРОЕКТА
echo ========================================
echo.

echo [1/4] Установка всех зависимостей...
call npm install
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось установить зависимости
    pause
    exit /b 1
)
echo ✓ Все зависимости установлены
echo.

echo [2/4] Установка Supabase пакетов...
call npm install @supabase/supabase-js@^2.39.0 @supabase/ssr@^0.1.0
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось установить Supabase пакеты
    pause
    exit /b 1
)
echo ✓ Supabase пакеты установлены
echo.

echo [3/4] Проверка структуры проекта...
set ERRORS=0

if exist lib\supabase\server.ts (
    echo ✓ lib/supabase/server.ts
) else (
    echo ✗ lib/supabase/server.ts не найден
    set /a ERRORS+=1
)

if exist lib\supabase\client.ts (
    echo ✓ lib/supabase/client.ts
) else (
    echo ✗ lib/supabase/client.ts не найден
    set /a ERRORS+=1
)

if exist lib\supabase\types.ts (
    echo ✓ lib/supabase/types.ts
) else (
    echo ✗ lib/supabase/types.ts не найден
    set /a ERRORS+=1
)

if exist supabase\schema.sql (
    echo ✓ supabase/schema.sql
) else (
    echo ✗ supabase/schema.sql не найден
    set /a ERRORS+=1
)

if exist middleware.ts (
    echo ✓ middleware.ts
) else (
    echo ✗ middleware.ts не найден
    set /a ERRORS+=1
)

if exist app\actions\requests.ts (
    echo ✓ app/actions/requests.ts
) else (
    echo ✗ app/actions/requests.ts не найден
    set /a ERRORS+=1
)

if %ERRORS% equ 0 (
    echo ✓ Все файлы на месте
) else (
    echo ✗ Найдено ошибок: %ERRORS%
)
echo.

echo [4/4] Проверка .env.local...
if exist .env.local (
    echo ✓ Файл .env.local существует
    echo   Проверьте, что в нем заполнены ключи из Supabase!
) else (
    echo ⚠ Файл .env.local не найден
    echo.
    echo Создайте файл .env.local со следующим содержимым:
    echo.
    echo NEXT_PUBLIC_SUPABASE_URL=ваш_project_url
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
    echo.
    echo Инструкция: см. БЫСТРЫЙ_СТАРТ.txt
)
echo.

echo ========================================
echo   УСТАНОВКА ЗАВЕРШЕНА
echo ========================================
echo.
echo Следующие шаги:
echo 1. Создайте проект на https://supabase.com
echo 2. Создайте .env.local и заполните ключи
echo 3. Выполните SQL из supabase/schema.sql
echo 4. Настройте Authentication
echo.
echo Подробная инструкция: БЫСТРЫЙ_СТАРТ.txt
echo.
pause

