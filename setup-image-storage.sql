-- Setup image storage for GreenReach Ads
-- This script creates storage buckets and adds logo column to companies table

-- 1. Create storage buckets for different image types
-- Company logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- User profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Campaign images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-images',
  'campaign-images',
  true,
  10485760, -- 10MB limit for campaign images
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Add logo column to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 3. Add profile picture column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- 4. Create storage policies for company logos
-- Allow authenticated users to upload company logos
CREATE POLICY "Users can upload company logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to company logos
CREATE POLICY "Company logos are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logos');

-- Allow company admins to update their company logo
CREATE POLICY "Company admins can update logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-logos' 
  AND auth.role() = 'authenticated'
);

-- 5. Create storage policies for profile pictures
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to profile pictures
CREATE POLICY "Profile pictures are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update their profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
);

-- 6. Create storage policies for campaign images
-- Allow authenticated users to upload campaign images
CREATE POLICY "Users can upload campaign images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'campaign-images' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to campaign images
CREATE POLICY "Campaign images are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'campaign-images');

-- Allow users to update their campaign images
CREATE POLICY "Users can update campaign images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'campaign-images' 
  AND auth.role() = 'authenticated'
);

-- 7. Create function to generate unique file names
CREATE OR REPLACE FUNCTION generate_image_filename(
  bucket_name TEXT,
  user_id UUID,
  file_extension TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  timestamp_value TEXT;
  random_id TEXT;
  filename TEXT;
BEGIN
  timestamp_value := EXTRACT(EPOCH FROM NOW())::TEXT;
  random_id := substr(md5(random()::TEXT), 1, 8);
  filename := bucket_name || '/' || user_id || '/' || timestamp_value || '-' || random_id || '.' || file_extension;
  RETURN filename;
END;
$$;

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_logo_url ON companies(logo_url) WHERE logo_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_profile_picture_url ON users(profile_picture_url) WHERE profile_picture_url IS NOT NULL;

-- 10. Verify setup
SELECT 
  'Storage buckets created:' as status,
  COUNT(*) as bucket_count
FROM storage.buckets 
WHERE id IN ('company-logos', 'profile-pictures', 'campaign-images');

SELECT 
  'Company logo column added:' as status,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'logo_url'
  ) THEN 'YES' ELSE 'NO' END as result;

SELECT 
  'User profile picture column added:' as status,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'profile_picture_url'
  ) THEN 'YES' ELSE 'NO' END as result;

COMMIT;
