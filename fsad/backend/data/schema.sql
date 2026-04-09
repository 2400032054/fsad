CREATE TABLE recommendations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  investment_level TEXT NOT NULL,
  impact_score INTEGER NOT NULL,
  suitable_for TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT NOT NULL
);

CREATE TABLE property_listings (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  property_type TEXT NOT NULL,
  bhk INTEGER NOT NULL,
  budget_lakhs INTEGER NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE property_submissions (
  id TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL,
  city TEXT NOT NULL,
  property_type TEXT NOT NULL,
  bhk INTEGER NOT NULL,
  budget_lakhs INTEGER NOT NULL,
  priorities TEXT NOT NULL,
  current_issues TEXT NOT NULL,
  created_at TEXT NOT NULL
);
