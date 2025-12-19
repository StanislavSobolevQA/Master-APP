-- Migration for improving RLS policies and adding indexes
-- Safe version that can be run multiple times

-- 1. Improved indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_category ON requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON requests(urgency);
CREATE INDEX IF NOT EXISTS idx_requests_reward_type ON requests(reward_type);
CREATE INDEX IF NOT EXISTS idx_requests_category_status ON requests(category, status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at_category ON requests(created_at DESC, category);

-- 2. Improved RLS policies for requests
-- Check if policy exists before dropping
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'requests' 
    AND policyname = 'Anyone can view requests'
  ) THEN
    DROP POLICY "Anyone can view requests" ON requests;
  END IF;
END $$;

-- Create new policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'requests' 
    AND policyname = 'Anyone can view requests without contact'
  ) THEN
    CREATE POLICY "Anyone can view requests without contact"
      ON requests FOR SELECT
      USING (true);
  END IF;
END $$;

-- 3. Table for status change history
CREATE TABLE IF NOT EXISTS request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_request_id ON request_status_history(request_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_at ON request_status_history(created_at DESC);

-- RLS for status history
ALTER TABLE request_status_history ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'request_status_history' 
    AND policyname = 'Users can view status history for their requests'
  ) THEN
    CREATE POLICY "Users can view status history for their requests"
      ON request_status_history FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM requests 
          WHERE requests.id = request_status_history.request_id 
          AND requests.author_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 4. Table for notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  related_request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications' 
    AND policyname = 'Users can view own notifications'
  ) THEN
    CREATE POLICY "Users can view own notifications"
      ON notifications FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications' 
    AND policyname = 'Users can update own notifications'
  ) THEN
    CREATE POLICY "Users can update own notifications"
      ON notifications FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Function for automatic status change logging
CREATE OR REPLACE FUNCTION log_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO request_status_history (request_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic status change logging
DROP TRIGGER IF EXISTS trigger_log_status_change ON requests;
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE OF status ON requests
  FOR EACH ROW
  EXECUTE FUNCTION log_request_status_change();

-- 6. Function for creating notification on new offer
CREATE OR REPLACE FUNCTION notify_new_offer()
RETURNS TRIGGER AS $$
DECLARE
  request_author_id UUID;
  request_title TEXT;
BEGIN
  SELECT author_id, title INTO request_author_id, request_title
  FROM requests
  WHERE id = NEW.request_id;

  INSERT INTO notifications (user_id, type, title, message, related_request_id)
  VALUES (
    request_author_id,
    'new_offer',
    'Новый отклик на ваш запрос',
    'На ваш запрос "' || COALESCE(request_title, '') || '" поступил новый отклик.',
    NEW.request_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for creating notifications on new offer
DROP TRIGGER IF EXISTS trigger_notify_new_offer ON offers;
CREATE TRIGGER trigger_notify_new_offer
  AFTER INSERT ON offers
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_offer();

