
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Shop from '@/lib/models/Shops';
import SplashScreen from '@/lib/models/SplashScreens';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const shopId = params.id;
  let splashScreenId: string | undefined;
  try {
    const body = await req.json();
    splashScreenId = body.splashScreenId;
    if (!splashScreenId) {
      return NextResponse.json({ error: 'splashScreenId is required in body' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Check if splash screen exists
  const splashScreen = await SplashScreen.findById(splashScreenId);
  if (!splashScreen) {
    return NextResponse.json({ error: 'SplashScreen not found' }, { status: 404 });
  }

  // Find and update shop
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  }

  shop.selectSplashScreen = splashScreen._id;
  await shop.save();

  return NextResponse.json({ message: 'selectSplashScreen updated', shop });
}
