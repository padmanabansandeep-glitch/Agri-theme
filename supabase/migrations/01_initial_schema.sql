-- AgriSmart PostgreSQL Schema & Row Level Security (RLS) Migrations

-- 1. Farm Profiles
CREATE TABLE IF NOT EXISTS public.farm_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT,
    land_area NUMERIC NOT NULL DEFAULT 1.0,
    land_unit TEXT NOT NULL DEFAULT 'acres',
    soil_type TEXT NOT NULL,
    irrigation_available BOOLEAN DEFAULT true,
    water_source TEXT DEFAULT 'Canal / Borewell',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crop Recommendations History
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_profile_id UUID REFERENCES public.farm_profiles(id) ON DELETE SET NULL,
    inputs JSONB NOT NULL,
    results JSONB NOT NULL,
    confidence_score INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Expense Records
CREATE TABLE IF NOT EXISTS public.expense_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    land_area NUMERIC NOT NULL,
    land_unit TEXT NOT NULL DEFAULT 'acres',
    total_cost NUMERIC NOT NULL,
    breakdown JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Profit Projections
CREATE TABLE IF NOT EXISTS public.profit_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    land_area NUMERIC NOT NULL,
    total_cost NUMERIC NOT NULL,
    expected_profit NUMERIC NOT NULL,
    conservative_profit NUMERIC NOT NULL,
    optimistic_profit NUMERIC NOT NULL,
    scenarios JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all user data tables
ALTER TABLE public.farm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profit_estimates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Farm Profiles
CREATE POLICY "Users can only view their own farm profiles"
    ON public.farm_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farm profiles"
    ON public.farm_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm profiles"
    ON public.farm_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farm profiles"
    ON public.farm_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies: Crop Recommendations
CREATE POLICY "Users can only view their own recommendations"
    ON public.crop_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
    ON public.crop_recommendations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
    ON public.crop_recommendations FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies: Expense Records
CREATE POLICY "Users can only view their own expense plans"
    ON public.expense_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expense plans"
    ON public.expense_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expense plans"
    ON public.expense_records FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies: Profit Estimates
CREATE POLICY "Users can only view their own profit estimates"
    ON public.profit_estimates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profit estimates"
    ON public.profit_estimates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profit estimates"
    ON public.profit_estimates FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_farm_profiles_user ON public.farm_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON public.expense_records(user_id);
CREATE INDEX IF NOT EXISTS idx_profit_user ON public.profit_estimates(user_id);
