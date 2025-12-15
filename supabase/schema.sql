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

-- Создание таблицы offers
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  helper_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, helper_id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_district ON requests(district);
CREATE INDEX IF NOT EXISTS idx_requests_category ON requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON requests(urgency);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_request_id ON offers(request_id);
CREATE INDEX IF NOT EXISTS idx_offers_helper_id ON offers(helper_id);

-- RLS политики для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open requests"
  ON requests FOR SELECT
  USING (status = 'open' OR author_id = auth.uid());

CREATE POLICY "Users can create requests"
  ON requests FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own requests"
  ON requests FOR UPDATE
  USING (auth.uid() = author_id);

-- RLS политики для offers
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view offers for their requests"
  ON offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = offers.request_id 
      AND requests.author_id = auth.uid()
    )
    OR helper_id = auth.uid()
  );

CREATE POLICY "Users can create offers"
  ON offers FOR INSERT
  WITH CHECK (auth.uid() = helper_id);

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
    AND EXISTS (
      SELECT 1 FROM offers o
      WHERE o.request_id = request_uuid
        AND o.helper_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

