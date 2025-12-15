@echo off
chcp 65001 >nul
echo ========================================
echo   НАСТРОЙКА ПРОЕКТА SUPABASE
echo ========================================
echo.
echo Проект создан: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt
echo.

echo [ШАГ 1] Создание .env.local...
if exist .env.local (
    echo Файл .env.local уже существует
    choice /C YN /M "Перезаписать"
    if errorlevel 2 goto :skip_env
)

(
    echo # Supabase Configuration
    echo # Проект: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt
    echo.
    echo # ⚠ ВАЖНО: Заполните эти значения!
    echo # Получите их здесь: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt/settings/api
    echo.
    echo NEXT_PUBLIC_SUPABASE_URL=https://ykolqlmyogsltnirwozt.supabase.co
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key_здесь
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
) > .env.local

echo ✓ Файл .env.local создан!
echo.
echo ⚠ ВАЖНО: Откройте .env.local и заполните NEXT_PUBLIC_SUPABASE_ANON_KEY
echo.
echo Где найти ключ:
echo   1. Откройте: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt/settings/api
echo   2. Найдите "Project API keys"
echo   3. Скопируйте "anon public" key
echo   4. Вставьте в .env.local вместо "ваш_anon_key_здесь"
echo.

:skip_env
echo [ШАГ 2] SQL скрипт готов для выполнения
echo.
echo Выполните SQL скрипт:
echo   1. Откройте: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt/sql/new
echo   2. Скопируйте весь код из файла: supabase/schema.sql
echo   3. Вставьте в SQL Editor
echo   4. Нажмите Run (или F5)
echo.

echo [ШАГ 3] Настройка Authentication
echo.
echo Настройте Authentication:
echo   1. Откройте: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt/auth/url-configuration
echo   2. Site URL: http://localhost:3000
echo   3. Redirect URLs: добавьте оба:
echo      - http://localhost:3000/auth/callback
echo      - http://localhost:3000/dashboard
echo   4. Сохраните
echo.
echo   5. Перейдите: https://supabase.com/dashboard/project/ykolqlmyogsltnirwozt/auth/providers
echo   6. Включите Email provider (если не включен)
echo.

echo ========================================
echo   ЧЕКЛИСТ:
echo ========================================
echo.
echo [ ] Заполнен .env.local с реальным anon key
echo [ ] Выполнен SQL скрипт из supabase/schema.sql
echo [ ] Настроен Site URL: http://localhost:3000
echo [ ] Добавлены Redirect URLs (2 штуки)
echo [ ] Включен Email provider
echo.
echo После выполнения всех шагов запустите: npm run dev
echo.
pause

