# Image Cleanup on User Creation Failure

This document describes the image cleanup functionality that automatically removes uploaded images from Cloudinary when user creation fails.

## Overview

When creating users with uploaded images (PAN card, Aadhaar card, profile images), if the user creation process fails at any point, the system will automatically clean up the uploaded images from Cloudinary to prevent orphaned files.

## Implementation

### 1. Cloudinary Utility Functions

Located in `lib/cloudinary.ts`:

- `deleteImageFromCloudinary(imageUrl: string)`: Deletes a single image from Cloudinary
- `deleteMultipleImagesFromCloudinary(imageUrls: string[])`: Deletes multiple images from Cloudinary

### 2. User Creation Endpoint

The main user creation endpoint (`app/api/superAdmin/users/route.ts`) has been updated to include image cleanup logic:

#### Image Collection
```typescript
const uploadedImages = [
    panCardImage,
    aadharCardFrontImage,
    aadharCardBackImage,
    ...(profileImage ? [profileImage] : [])
].filter(Boolean);
```

#### User Save with Cleanup
```typescript
let savedUser;
try {
    savedUser = await newUser.save();
} catch (saveError) {
    // If user creation fails, clean up uploaded images
    console.error('Error saving user:', saveError);
    if (uploadedImages.length > 0) {
        console.log('Cleaning up uploaded images due to user creation failure...');
        await deleteMultipleImagesFromCloudinary(uploadedImages);
    }
    throw saveError;
}
```

#### Email Sending with Cleanup
```typescript
try {
    emailSent = await emailHandler.sendEmail({...});
} catch (emailError) {
    // If email fails, clean up images and delete user
    if (uploadedImages.length > 0) {
        console.log('Cleaning up uploaded images due to email sending failure...');
        await deleteMultipleImagesFromCloudinary(uploadedImages);
    }
    // Delete the created user since email failed
    await User.findByIdAndDelete(savedUser._id);
    throw emailError;
}
```

## Error Scenarios Handled

1. **Database Save Failure**: If saving the user to the database fails, all uploaded images are cleaned up
2. **Email Sending Failure**: If sending the welcome email fails, the user is deleted and all uploaded images are cleaned up
3. **General Error**: Any other error during the process triggers image cleanup

## Benefits

- **Prevents Orphaned Files**: No images are left in Cloudinary when user creation fails
- **Cost Optimization**: Reduces unnecessary storage costs
- **Data Consistency**: Ensures clean state when operations fail
- **Error Recovery**: Provides clear error handling and cleanup

## Usage

The cleanup logic is automatically applied in the user creation endpoint. No additional configuration is required.

## Testing

You can test the cleanup functionality by:
1. Uploading images during user creation
2. Simulating a failure (e.g., invalid email format, database connection issues)
3. Verifying that images are removed from Cloudinary

## Notes

- The cleanup functions use `Promise.allSettled()` to ensure all deletion attempts are made even if some fail
- Error logging is included for debugging purposes
- The cleanup is non-blocking and won't prevent the main error from being thrown 