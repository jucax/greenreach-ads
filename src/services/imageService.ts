
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
   * Upload a single image to Supabase Storage using direct REST API (like Mina app)
   * Currently using mock implementation for demo purposes
   */
  static async uploadImage(
    file: File,
    bucket: 'company-logos' | 'profile-pictures' | 'campaign-images',
    userId: string
  ): Promise<ImageUploadResult> {
    try {
      // MOCK IMPLEMENTATION FOR DEMO
      console.log(`🎭 Mock uploading image to ${bucket} bucket...`);
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Generate fake URL for demo purposes
      const fileExt = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomId}-${userId}.${fileExt}`;

      // Create fake URL that looks like a real Supabase storage URL
      const fakeUrl = `https://fake-storage.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
      
      console.log('🎭 Mock upload successful:', fakeUrl);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        url: fakeUrl
      };

      /* ORIGINAL SUPABASE UPLOAD CODE - COMMENTED OUT FOR DEMO
      console.log(`📤 Uploading image to ${bucket} bucket...`);
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Generate unique filename
      const fileExt = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}-${randomId}-${userId}.${fileExt}`;

      console.log('📝 Generated filename:', fileName);

      // Use direct REST API upload like Mina app
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${fileName}`;

      console.log('🚀 Uploading to Supabase Storage REST endpoint...');
      
      // Use FormData like mina_app does
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: formData,
      });

      console.log('📤 Upload response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      // Construct the public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
      console.log('✅ Image uploaded successfully:', publicUrl);

      return {
        success: true,
        url: publicUrl
      };
      */

    } catch (error) {
      console.error('💥 Unexpected error during mock image upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Upload multiple images to Supabase Storage
   * Currently using mock implementation for demo purposes
   */
  static async uploadMultipleImages(
    files: File[],
    bucket: 'company-logos' | 'profile-pictures' | 'campaign-images',
    userId: string
  ): Promise<MultipleImageUploadResult> {
    try {
      // MOCK IMPLEMENTATION FOR DEMO
      console.log(`🎭 Mock uploading ${files.length} images to ${bucket} bucket...`);

      const uploadPromises = files.map((file, index) => 
        this.uploadImage(file, bucket, `${userId}-${index}`)
      );

      const results = await Promise.all(uploadPromises);
      
      // Check if all uploads were successful
      const failedUploads = results.filter(result => !result.success);
      
      if (failedUploads.length > 0) {
        console.error('❌ Some mock uploads failed:', failedUploads);
        return {
          success: false,
          error: `${failedUploads.length} out of ${files.length} images failed to upload`
        };
      }

      const urls = results
        .filter(result => result.success && result.url)
        .map(result => result.url!);

      console.log('🎭 All mock images uploaded successfully:', urls);

      return {
        success: true,
        urls
      };

    } catch (error) {
      console.error('💥 Unexpected error during mock multiple image upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Delete an image from Supabase Storage
   * Currently using mock implementation for demo purposes
   */
  static async deleteImage(
    url: string,
    bucket: 'company-logos' | 'profile-pictures' | 'campaign-images'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // MOCK IMPLEMENTATION FOR DEMO
      console.log(`🎭 Mock deleting image from ${bucket}:`, url);

      // Simulate delete delay
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log('🎭 Mock image deleted successfully');
      return { success: true };

      /* ORIGINAL SUPABASE DELETE CODE - COMMENTED OUT FOR DEMO
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
      */

    } catch (error) {
      console.error('💥 Unexpected error during mock image deletion:', error);
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
