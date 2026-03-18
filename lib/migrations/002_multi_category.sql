-- ============================================
-- Migration 002: Multi-category civic reporting (Община Бургас)
-- Idempotent: safe to run multiple times.
-- Run in Supabase SQL Editor.
-- ============================================

-- 1) Add/normalize columns on reports
ALTER TABLE reports ADD COLUMN IF NOT EXISTS municipality text NOT NULL DEFAULT 'Burgas';
ALTER TABLE reports ADD COLUMN IF NOT EXISTS settlement text NOT NULL DEFAULT 'Burgas';
-- category/status are TEXT now (not Postgres enums)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'pothole'::text;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'::text;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolved_at timestamptz NULL;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- If this migration is applied to an existing DB where category/status are still enums,
-- convert them to text so they match `lib/schema.sql`.
DO $$
BEGIN
  -- Convert enum -> text (the USING casts enum labels to text)
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'reports'
      AND column_name = 'category'
  ) THEN
    EXECUTE 'ALTER TABLE reports ALTER COLUMN category TYPE text USING category::text';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'reports'
      AND column_name = 'status'
  ) THEN
    EXECUTE 'ALTER TABLE reports ALTER COLUMN status TYPE text USING status::text';
  END IF;
EXCEPTION
  WHEN undefined_column THEN NULL;
  WHEN others THEN NULL; -- keep idempotent even if types are already text / casts fail
END;
$$;

-- Drop old enum types if they still exist (safe after conversion above).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_category') THEN
    BEGIN
      EXECUTE 'DROP TYPE report_category';
    EXCEPTION
      WHEN others THEN NULL;
    END;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    BEGIN
      EXECUTE 'DROP TYPE report_status';
    EXCEPTION
      WHEN others THEN NULL;
    END;
  END IF;
END;
$$;

-- 3) Optional: migrate settlement from city where we have non-default city
UPDATE reports
SET settlement = city
WHERE settlement = 'Burgas' AND city IS NOT NULL AND city != 'Burgas';

-- 4) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_verified ON reports (verified);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports (category);
CREATE INDEX IF NOT EXISTS idx_reports_municipality_settlement ON reports (municipality, settlement);
CREATE INDEX IF NOT EXISTS idx_reports_created_at_desc ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_lat_lng ON reports (lat, lng);

-- 5) Trigger function: set updated_at on UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6) Trigger (drop first to avoid duplicate, then create)
DROP TRIGGER IF EXISTS reports_set_updated_at ON reports;
CREATE TRIGGER reports_set_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();
