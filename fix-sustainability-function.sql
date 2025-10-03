-- Fix sustainability metrics function for campaign creation
-- This script ensures the calculate_sustainability_metrics function exists and works properly

-- Drop the function if it exists
DROP FUNCTION IF EXISTS calculate_sustainability_metrics(numeric);

-- Create the sustainability metrics calculation function
CREATE OR REPLACE FUNCTION calculate_sustainability_metrics(campaign_budget numeric)
RETURNS TABLE(
    energy_used_kwh numeric,
    co2_avoided_kg numeric,
    green_score text
) 
LANGUAGE plpgsql
AS $$
DECLARE
    traditional_energy numeric;
    optimized_energy numeric;
    co2_saved numeric;
    score text;
BEGIN
    -- Calculate traditional energy usage (0.076 kWh per dollar)
    traditional_energy := campaign_budget * 0.076;
    
    -- Calculate optimized energy usage (40% of traditional)
    optimized_energy := traditional_energy * 0.4;
    
    -- Calculate CO2 saved (0.5 kg CO2 per kWh saved)
    co2_saved := (traditional_energy - optimized_energy) * 0.5;
    
    -- Determine green score based on optimization level
    IF optimized_energy < traditional_energy * 0.35 THEN
        score := 'A+';
    ELSIF optimized_energy < traditional_energy * 0.40 THEN
        score := 'A';
    ELSIF optimized_energy < traditional_energy * 0.45 THEN
        score := 'A-';
    ELSIF optimized_energy < traditional_energy * 0.50 THEN
        score := 'B+';
    ELSIF optimized_energy < traditional_energy * 0.60 THEN
        score := 'B';
    ELSIF optimized_energy < traditional_energy * 0.70 THEN
        score := 'B-';
    ELSIF optimized_energy < traditional_energy * 0.80 THEN
        score := 'C+';
    ELSIF optimized_energy < traditional_energy * 0.90 THEN
        score := 'C';
    ELSIF optimized_energy < traditional_energy * 0.95 THEN
        score := 'C-';
    ELSE
        score := 'D';
    END IF;
    
    -- Return the calculated metrics
    RETURN QUERY SELECT optimized_energy, co2_saved, score;
END;
$$;

-- Test the function
SELECT * FROM calculate_sustainability_metrics(500);

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION calculate_sustainability_metrics(numeric) TO authenticated;

COMMIT;
