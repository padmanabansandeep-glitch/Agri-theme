-- AgriSmart Seed Data (Demo references and pre-seeded records)
-- In demo mode or local environments, these serve as baseline templates

-- Sample demo profile for testing
INSERT INTO public.farm_profiles (id, farm_name, state, district, land_area, land_unit, soil_type, irrigation_available, water_source)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Cauvery Delta Organic Plot', 'Tamil Nadu', 'Thanjavur', 3.5, 'acres', 'alluvial', true, 'Canal Irrigation'),
  ('00000000-0000-0000-0000-000000000002', 'Malwa Black Soil Holding', 'Madhya Pradesh', 'Indore', 5.0, 'acres', 'black', true, 'Borewell / Sprinkler')
ON CONFLICT (id) DO NOTHING;
