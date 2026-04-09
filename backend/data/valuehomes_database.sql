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

INSERT INTO recommendations (id, title, category, investment_level, impact_score, suitable_for, description, benefits) VALUES
('2e542236', 'Balcony Utility Conversion', 'Space Optimization', 'Low', 78, 'Urban flats', 'Turn underused balconies into work-from-home or utility corners with weather-safe finishes.', 'Better usable area;Modern lifestyle fit;Low renovation cost'),
('5b628ae7', 'Exterior Paint and Gate Upgrade', 'Curb Appeal', 'Low', 74, 'Independent houses', 'Refresh street-facing walls, gate paint, and entrance lighting for a stronger first impression.', 'Better first impression;Low cost uplift;Neighborhood standout'),
('f3728f16', 'Solar and Energy Saving Package', 'Sustainability', 'High', 84, 'Sun-exposed properties', 'Add solar lighting, efficient fans, and inverter-ready electrical planning to reduce long-term cost.', 'Lower bills;Future-ready home;Eco-friendly branding');

INSERT INTO property_listings (id, headline, city, area, property_type, bhk, budget_lakhs, status) VALUES
('dbd1878b', '2 BHK apartment near metro corridor', 'Bengaluru', 'Whitefield', 'Apartment', 2, 68, 'Active'),
('7180f454', '3 BHK family home with terrace potential', 'Pune', 'Wakad', 'Independent House', 3, 92, 'Active'),
('42a22ec0', 'Budget-friendly resale flat for first-time buyers', 'Hyderabad', 'Miyapur', 'Apartment', 2, 56, 'Featured');

INSERT INTO property_submissions (id, owner_name, city, property_type, bhk, budget_lakhs, priorities, current_issues, created_at) VALUES
('438d8e00', 'Ravi', 'Pune', 'Apartment', 2, 65, 'better resale value and storage', 'dark kitchen, outdated bathroom', '2026-04-09T13:03:10');
