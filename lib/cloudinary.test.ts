// Test file to demonstrate image cleanup functionality
// This file is for documentation purposes and can be removed in production

import { deleteImageFromCloudinary, deleteMultipleImagesFromCloudinary } from './cloudinary';

// Example usage of the image cleanup functions
export const testImageCleanup = async () => {
  // Example image URLs (these would be actual Cloudinary URLs in real usage)
  const exampleImages = [
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/shop-images/pan-card.jpg',
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/shop-images/aadhaar-front.jpg',
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/shop-images/aadhaar-back.jpg',
    'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/shop-images/profile.jpg'
  ];

  // Delete a single image
  const singleResult = await deleteImageFromCloudinary(exampleImages[0]);
  console.log('Single image deletion result:', singleResult);

  // Delete multiple images
  await deleteMultipleImagesFromCloudinary(exampleImages);
  console.log('Multiple images deletion completed');
};

// Example of how to use in user creation failure scenarios
export const handleUserCreationFailure = async (uploadedImages: string[]) => {
  try {
    // Simulate user creation logic
    // const user = await createUser(userData);
    
    // If user creation fails, clean up images
    if (uploadedImages.length > 0) {
      console.log('Cleaning up uploaded images due to user creation failure...');
      await deleteMultipleImagesFromCloudinary(uploadedImages);
    }
  } catch (error) {
    console.error('User creation failed:', error);
    // Images are already cleaned up in the try block
  }
}; 