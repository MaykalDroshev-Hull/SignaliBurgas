-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.report_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL,
  storage_path text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT report_photos_pkey PRIMARY KEY (id),
  CONSTRAINT report_photos_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id)
);
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  city text NOT NULL DEFAULT 'Burgas'::text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  severity integer NOT NULL CHECK (severity = ANY (ARRAY[1, 2, 3])),
  comment text,
  email_hash text NOT NULL,
  verify_token_hash text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text,
  last_name text,
  municipality text NOT NULL DEFAULT 'Burgas'::text,
  settlement text NOT NULL DEFAULT 'Burgas'::text,
  category text NOT NULL DEFAULT 'pothole'::text,
  status text NOT NULL DEFAULT 'new'::text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT reports_pkey PRIMARY KEY (id)
);