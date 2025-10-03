import { supabase } from '../lib/supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface MultipleImageUploadResult {
  success: boolean;
  urls?: string[];
  error?: string;
}

export class ImageService {
  /**
   * Upload a single image to Supabase Storage
   */
  static async uploadImage(
    file: File,
    bucket: 'company-logos' | 'profile-pictures' | 'campaign-images',
    userId: string
  ): Promise<ImageUploadResult> {
    try {
      console.log(`📤 Uploading image to ${bucket} bucket...`);
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Generate unique filename
      const fileExt = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileName = `${userId}/${timestamp}-${randomId}.${fileExt}`;

      console.log('📝 Generated filename:', fileName);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('✅ Image uploaded successfully:', publicUrl);

      return {
        success: true,
        url: publicUrl
      };

    } catch (error) {
      console.error('💥 Unexpected error during image upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Upload multiple images to Supabase Storage
   */
  static async uploadMultipleImages(
    files: File[],
    bucket: 'company-logos' | 'profile-pictures' | 'campaign-images',
    userId: string
  ): Promise<MultipleImageUploadResult> {
    try {
      console.log(`📤 Uploading ${files.length} images to ${bucket} bucket...`);

      const uploadPromises = files.map((file, index) => 
        this.uploadImage(file, bucket, `${userId}-${index}`)
      );

      const results = await Promise.all(uploadPromises);
      
      // Check if all uploads were successful
      const failedUploads = results.filter(result => !result.success);
      
      if (failedUploads.length > 0) {
        console.error('❌ Some uploads failed:', failedUploads);
        return {
          success: false,
          error: `${failedUploads.length} out of ${files.length} images failed to upload`
        };
      }

      const urls = results
        .filter(result => result.success && result.url)
        .map(result => result.url!);

      console.log('✅ All images uploaded successfully:', urls);

      return {
        success: true,
        urls
      };

    } catch (error) {
      console.error('💥 Unexpected error during multiple image upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(
    url: string,
    bucket: 'company-logos' | 'profile-pictures' | 'campaign-images'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ Deleting image from ${bucket}:`, url);

      // Extract filename from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Remove query parameters if any
      const cleanFileName = fileName.split('?')[0];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([cleanFileName]);

      if (error) {
        console.error('❌ Delete error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Image deleted successfully');
      return { success: true };

    } catch (error) {
      console.error('💥 Unexpected error during image deletion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPG, PNG, and WebP files are allowed'
      };
    }

    // Check file size (5MB limit for most images, 10MB for campaign images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB'
      };
    }

    return { valid: true };
  }

  /**
   * Validate campaign image file (larger size limit)
   */
  static validateCampaignImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPG, PNG, and WebP files are allowed'
      };
    }

    // Check file size (10MB limit for campaign images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 10MB'
      };
    }

    return { valid: true };
  }

  /**
   * Create image preview URL
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke preview URL to free memory
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
