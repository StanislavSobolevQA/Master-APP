# Supabase миграции для "Рядом"

## Установка Supabase локально

1. Установите Supabase CLI:
```bash
npm install -g supabase
```

2. Инициализируйте проект:
```bash
supabase init
```

3. Запустите локальный Supabase:
```bash
supabase start
```

4. Примените миграции:
```bash
supabase db reset
```

## Или используйте Supabase Cloud

1. Создайте проект на https://supabase.com
2. Перейдите в SQL Editor
3. Скопируйте содержимое `migrations/001_initial_schema.sql`
4. Выполните SQL в редакторе

## Переменные окружения

После настройки Supabase добавьте в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Структура базы данных

- **profiles** - профили пользователей
- **requests** - запросы на помощь
- **offers** - отклики на запросы

## Безопасность

- RLS включен на всех таблицах
- Контакты скрыты и доступны только через функцию `get_request_contact()`
- Пользователи могут создавать только свои запросы
- Отклики может создавать любой авторизованный пользователь (кроме автора)

