-- Core PostgreSQL + PostGIS schema (simplified)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(32) UNIQUE NOT NULL,
  name TEXT,
  nida_number TEXT,
  role TEXT,
  trust_score NUMERIC DEFAULT 0,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Farms
CREATE TABLE IF NOT EXISTS farms (
  farm_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  name TEXT,
  farm_boundary GEOMETRY(POLYGON,4326),
  soil_type TEXT,
  total_acres NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fields (per-farm)
CREATE TABLE IF NOT EXISTS fields (
  field_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(farm_id),
  name TEXT,
  crop TEXT,
  planting_date DATE,
  harvest_date DATE,
  field_boundary GEOMETRY(POLYGON,4326)
);

-- Batches
CREATE TABLE IF NOT EXISTS batches (
  batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(user_id),
  crop_type TEXT,
  quantity NUMERIC,
  harvest_date DATE,
  quality_grade TEXT,
  current_location GEOMETRY(POINT,4326)
);

-- Batch events
CREATE TABLE IF NOT EXISTS batch_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(batch_id),
  actor_id UUID,
  event_type TEXT,
  location GEOMETRY(POINT,4326),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Marketplace listings
CREATE TABLE IF NOT EXISTS listings (
  listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(user_id),
  crop_type TEXT,
  quantity NUMERIC,
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Jicho scan history
CREATE TABLE IF NOT EXISTS jicho_scans (
  scan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(user_id),
  diagnosis TEXT,
  confidence NUMERIC,
  gps GEOMETRY(POINT,4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
