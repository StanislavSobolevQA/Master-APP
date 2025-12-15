-- Создание таблицы profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  district TEXT,
  telegram TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы requests
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('thanks', 'money')),
  reward_amount INTEGER,
  district TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('telegram', 'phone')),
  contact_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы offers (отклики)
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  helper_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, helper_id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_requests_district ON requests(district);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_author_id ON requests(author_id);
CREATE INDEX IF NOT EXISTS idx_offers_request_id ON offers(request_id);
CREATE INDEX IF NOT EXISTS idx_offers_helper_id ON offers(helper_id);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON profiles(district);

-- Полнотекстовый поиск по title и description
CREATE INDEX IF NOT EXISTS idx_requests_search ON requests USING gin(
  to_tsvector('russian', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- Включение RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- RLS политики для profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS политики для requests
-- Чтение: все могут видеть запросы, но contact_value скрыт (будет через функцию)
CREATE POLICY "Anyone can view requests"
  ON requests FOR SELECT
  USING (true);

-- Вставка: только авторизованные пользователи
CREATE POLICY "Authenticated users can create requests"
  ON requests FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Обновление статуса: только автор
CREATE POLICY "Authors can update their requests"
  ON requests FOR UPDATE
  USING (auth.uid() = author_id);

-- RLS политики для offers
-- Чтение: автор запроса и helper могут видеть отклики
CREATE POLICY "Request authors and helpers can view offers"
  ON offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = offers.request_id 
      AND requests.author_id = auth.uid()
    )
    OR helper_id = auth.uid()
  );

-- Создание отклика: только авторизованные пользователи (не автор запроса)
CREATE POLICY "Authenticated users can create offers"
  ON offers FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() != (
      SELECT author_id FROM requests WHERE id = request_id
    )
  );

-- Функция для безопасного получения контакта
CREATE OR REPLACE FUNCTION get_request_contact(request_uuid UUID)
RETURNS TABLE(contact_type TEXT, contact_value TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.contact_type,
    r.contact_value
  FROM requests r
  WHERE r.id = request_uuid
  AND (
    -- Автор запроса всегда видит свой контакт
    r.author_id = auth.uid()
    OR
    -- Helper видит контакт только если есть отклик
    EXISTS (
      SELECT 1 FROM offers o
      WHERE o.request_id = r.id
      AND o.helper_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Комментарии для документации
COMMENT ON TABLE profiles IS 'Профили пользователей';
COMMENT ON TABLE requests IS 'Запросы на помощь';
COMMENT ON TABLE offers IS 'Отклики на запросы';
COMMENT ON FUNCTION get_request_contact IS 'Безопасное получение контакта автора запроса';

