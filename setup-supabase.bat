@echo off
chcp 65001 >nul
echo ========================================
echo   Установка зависимостей Supabase
echo ========================================
echo.

echo [1/3] Установка @supabase/supabase-js и @supabase/ssr...
call npm install @supabase/supabase-js @supabase/ssr
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось установить зависимости
    pause
    exit /b 1
)
echo ✓ Зависимости установлены
echo.

echo [2/3] Проверка .env.local...
if exist .env.local (
    echo ✓ Файл .env.local уже существует
) else (
    echo Создание .env.local из шаблона...
    (
        echo # Supabase
        echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        echo.
        echo # Site URL ^(для редиректов после авторизации^)
        echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ) > .env.local
    echo ✓ Файл .env.local создан
    echo.
    echo ⚠ ВАЖНО: Заполните .env.local своими данными из Supabase!
)
echo.

echo [3/3] Проверка структуры проекта...
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
if exist supabase\schema.sql (
    echo ✓ supabase/schema.sql
) else (
    echo ✗ supabase/schema.sql не найден
)
echo.

echo ========================================
echo   Готово!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Создайте проект на https://supabase.com
echo 2. Откройте .env.local и заполните ключи
echo 3. Выполните SQL из supabase/schema.sql в SQL Editor
echo 4. Настройте Authentication в панели Supabase
echo.
echo Подробная инструкция: ИНСТРУКЦИЯ_ПО_НАСТРОЙКЕ.txt
echo.
pause

