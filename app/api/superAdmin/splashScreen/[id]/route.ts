import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Shop from '@/lib/models/Shops';
import SplashScreen from '@/lib/models/SplashScreens';



export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const splashScreen = await SplashScreen.findById(params.id);
    if (!splashScreen) {
      return NextResponse.json(
        { success: false, message: 'Splash screen not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, splashScreen }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const shopId = params.id;
    const body = await req.json();

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json(
        { success: false, message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Create new splash screen
    const splashScreenData = {
      animationType: body.animationType || 'fade',
      backgroundColor: body.backgroundColor || '#ffffff',
      duration: body.duration || 3000,
      logoHeight: body.logoHeight || 100,
      logoSvg: body.logoSvg || '',
      logoWidth: body.logoWidth || 100,
      shopName: body.shopName || shop.shopName,
      slogan: body.slogan || '',
      textColor: body.textColor || '#000000',
      transitionStyle: body.transitionStyle || 'ease-in-out'
    };

    const newSplashScreen = new SplashScreen(splashScreenData);
    const savedSplashScreen = await newSplashScreen.save();

    // Update shop's splashScreen array with the new splash screen ID
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      {
        $push: { splashScreen: savedSplashScreen._id }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Splash screen created and added to shop successfully',
      splashScreen: savedSplashScreen,
      shop: updatedShop
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating splash screen:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
