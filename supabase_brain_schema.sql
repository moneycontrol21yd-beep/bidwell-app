-- 1. Contractor Profile Table
CREATE TABLE IF NOT EXISTS contractor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  gstin TEXT,
  state TEXT,
  turnover_in_lakhs NUMERIC DEFAULT 0,
  iso_certified BOOLEAN DEFAULT false,
  psara_license BOOLEAN DEFAULT false,
  class_category TEXT, -- e.g., 'Class-1', 'Class-2'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Master Tender Data Table (Central, State, UT, PSUs)
CREATE TABLE IF NOT EXISTS master_tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  state_or_union TEXT NOT NULL,
  estimated_value_lakhs NUMERIC,
  min_turnover_required NUMERIC DEFAULT 0,
  iso_required BOOLEAN DEFAULT false,
  closing_date DATE,
  status TEXT DEFAULT 'Active', -- 'Active', 'Cancelled', 'Re-Tendered'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Competitor & Winner Intelligence (AOC Engine)
CREATE TABLE IF NOT EXISTS tender_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id TEXT REFERENCES master_tenders(tender_id),
  winning_contractor TEXT NOT NULL,
  winning_bid_amount NUMERIC NOT NULL,
  l1_margin_percent NUMERIC,
  award_date DATE
);
