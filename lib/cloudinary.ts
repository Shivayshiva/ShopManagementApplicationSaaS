import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Utility function to delete images from Cloudinary
export const deleteImageFromCloudinary = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract public_id from imageUrl (format: .../upload/v1234/folder/filename.ext)
    const matches = imageUrl.match(/\/upload\/v\d+\/(.+)$/);
    const publicId = matches ? matches[1].replace(/\.[a-zA-Z0-9]+$/, '') : null;
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

// Utility function to delete multiple images from Cloudinary
export const deleteMultipleImagesFromCloudinary = async (imageUrls: string[]): Promise<void> => {
  const deletePromises = imageUrls.map(url => deleteImageFromCloudinary(url));
  await Promise.allSettled(deletePromises);
};

export default cloudinary
