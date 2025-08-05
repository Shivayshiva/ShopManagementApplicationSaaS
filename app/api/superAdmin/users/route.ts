import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Shop from '@/lib/models/Shops';
import User from '@/lib/models/User';
import { emailHandler } from '@/utils/nodemailer';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { deleteMultipleImagesFromCloudinary } from '@/lib/cloudinary';

const createUserSchema = z.object({
    gstNumber: z.string().min(1, 'GST number is required'),
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
    role: z.enum(['admin', 'manager', 'staff', 'cashier']).default('staff'),
    shopId: z.string().min(1, 'Shop ID is required'),
    superAdminId: z.string().min(1, 'Super Admin ID is required'),
    panCardNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card number format'),
    aadharCardNumber: z.string().regex(/^[0-9]{12}$/, 'Invalid Aadhaar number format'),
    panCardImage: z.string().url('PAN card image URL is required'),
    aadharCardFrontImage: z.string().url('Aadhaar front image URL is required'),
    aadharCardBackImage: z.string().url('Aadhaar back image URL is required'),
    profileImage: z.string().url().optional()
});

export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        // Validate request body
        const validationResult = createUserSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const {
            gstNumber,
            email,
            name,
            mobileNumber,
            role,
            shopId,
            superAdminId,
            panCardNumber,
            aadharCardNumber,
            panCardImage,
            aadharCardFrontImage,
            aadharCardBackImage,
            profileImage
        } = validationResult.data;

        // Check if shop exists with the given GST number
        const existingShop = await Shop.findOne({ shopId });
        if (!existingShop) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Shop with this GST number does not exist'
                },
                { status: 404 }
            );
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User with this email already exists'
                },
                { status: 409 }
            );
        }

        // Check if user already exists with this mobile number
        const existingUserByMobile = await User.findOne({ mobileNumber });
        if (existingUserByMobile) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User with this mobile number already exists'
                },
                { status: 409 }
            );
        }

        // Generate random password
        const randomPassword = nanoid(12); // Generate 12 character random password
        const passwordHash = await bcrypt.hash(randomPassword, 12);

        // Collect all image URLs for cleanup in case of failure
        const uploadedImages = [
            panCardImage,
            aadharCardFrontImage,
            aadharCardBackImage,
            ...(profileImage ? [profileImage] : [])
        ].filter(Boolean);

        // Create new user with document information
        const newUser = new User({
            name,
            mobileNumber,
            email,
            passwordHash,
            role,
            shopId,
            superAdminId,
            isActive: true,
            userType: 'shop_user',
            // Document information
            userAdhaar: {
                number: aadharCardNumber,
                adhaarFront: aadharCardFrontImage,
                adhaarBack: aadharCardBackImage,
            },
            userPanCard: {
                number: panCardNumber,
                PanImage: panCardImage,
            },
            userProfileImage: profileImage || null
        });

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

        // Send email with credentials
        let emailSent;
        try {
            emailSent = await emailHandler.sendEmail({
                to: email,
                subject: 'Your Account Credentials - Shop Management System',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Shop Management System!</h2>
          <p>Hello ${name},</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${randomPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          <p>You can now access your dashboard and start managing your shop efficiently.</p>
          <p>Best regards,<br>The Shop Management Team</p>
        </div>
      `,
                text: `
Welcome to Shop Management System!

Hello ${name},

Your account has been created successfully. Here are your login credentials:

Email: ${email}
Password: ${randomPassword}

Important: Please change your password after your first login for security purposes.

You can now access your dashboard and start managing your shop efficiently.

Best regards,
The Shop Management Team
      `
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // If email fails, we still want to clean up images and return error
            if (uploadedImages.length > 0) {
                console.log('Cleaning up uploaded images due to email sending failure...');
                await deleteMultipleImagesFromCloudinary(uploadedImages);
            }
            // Delete the created user since email failed
            await User.findByIdAndDelete(savedUser._id);
            throw emailError;
        }

        if (!emailSent) {
            console.warn('Failed to send email to user:', email);
            // If email fails, clean up images and delete user
            if (uploadedImages.length > 0) {
                console.log('Cleaning up uploaded images due to email sending failure...');
                await deleteMultipleImagesFromCloudinary(uploadedImages);
            }
            // Delete the created user since email failed
            await User.findByIdAndDelete(savedUser._id);
            return NextResponse.json({
                success: false,
                error: 'User creation failed due to email sending error'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: savedUser,
            message: 'User created successfully and credentials sent via email'
        });

    } catch (error) {
        console.error('Error creating user:', error);

        // If we have uploaded images and an error occurred, clean them up
        if (error && typeof error === 'object' && 'uploadedImages' in error) {
            const images = (error as any).uploadedImages;
            if (images && images.length > 0) {
                console.log('Cleaning up uploaded images due to error...');
                await deleteMultipleImagesFromCloudinary(images);
            }
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create user'
            },
            { status: 500 }
        );
    }
}
