-- Fix missing functions for GreenReach Ads
-- This script creates the missing database functions

-- 1. Create generate_company_code function
CREATE OR REPLACE FUNCTION generate_company_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random company code in format GR-XXXXXX
        new_code := 'GR-' || UPPER(substr(md5(random()::text), 1, 6));
        
        -- Check if this code already exists
        SELECT EXISTS(SELECT 1 FROM companies WHERE company_code = new_code) INTO code_exists;
        
        -- If code doesn't exist, we can use it
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$;

-- 2. Create calculate_sustainability_metrics function (if it doesn't exist)
CREATE OR REPLACE FUNCTION calculate_sustainability_metrics(campaign_budget NUMERIC)
RETURNS TABLE (energy_used_kwh NUMERIC, co2_avoided_kg NUMERIC, green_score TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    traditional_energy_kwh NUMERIC;
    optimized_energy_kwh NUMERIC;
    co2_saved NUMERIC;
    score TEXT;
BEGIN
    -- Assume a baseline: traditional campaigns use X kWh per dollar
    -- For example, 0.076 kWh per dollar based on industry averages for digital ads
    traditional_energy_kwh := campaign_budget * 0.076;

    -- GreenReach Ads optimization: reduce energy consumption by a certain percentage
    -- For example, 60% reduction compared to traditional methods
    optimized_energy_kwh := traditional_energy_kwh * 0.40; -- 40% of traditional energy

    -- Calculate CO2 avoided (e.g., 0.5 kg CO2 per kWh saved)
    co2_saved := (traditional_energy_kwh - optimized_energy_kwh) * 0.5;

    -- Determine green score based on energy efficiency
    IF optimized_energy_kwh < traditional_energy_kwh * 0.35 THEN
        score := 'A+';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.40 THEN
        score := 'A';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.45 THEN
        score := 'A-';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.50 THEN
        score := 'B+';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.60 THEN
        score := 'B';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.70 THEN
        score := 'B-';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.80 THEN
        score := 'C+';
    ELSIF optimized_energy_kwh < traditional_energy_kwh * 0.90 THEN
        score := 'C';
    ELSE
        score := 'C-';
    END IF;

    RETURN QUERY SELECT optimized_energy_kwh, co2_saved, score;
END;
$$;

-- 3. Grant permissions to the authenticated role
GRANT EXECUTE ON FUNCTION generate_company_code() TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_sustainability_metrics(numeric) TO authenticated;

-- 4. Test the functions
SELECT 'Testing generate_company_code function:' as test;
SELECT generate_company_code() as sample_code;

SELECT 'Testing calculate_sustainability_metrics function:' as test;
SELECT * FROM calculate_sustainability_metrics(1000);

-- 5. Verify functions exist
SELECT 
    'Functions created successfully:' as status,
    COUNT(*) as function_count
FROM pg_proc 
WHERE proname IN ('generate_company_code', 'calculate_sustainability_metrics');

COMMIT;
