
// POST: Get splash screens by array of IDs
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'ids must be a non-empty array' }, { status: 400 });
    }
    const splashScreens = await SplashScreen.find({ _id: { $in: ids } });
    return NextResponse.json({ success: true, splashScreens }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import SplashScreen from "@/lib/models/SplashScreens";
import { z } from "zod";

const splashScreenSchema = z.object({
  animationType: z.string(),
  backgroundColor: z.string(),
  duration: z.number(),
  logoHeight: z.number().optional(),
  logoSvg: z.string().optional(),
  logoWidth: z.number().optional(),
  shopName: z.string(),
  slogan: z.string(),
  textColor: z.string(),
  transitionStyle: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url!);
    const idsParam = url.searchParams.getAll('ids');
    if (idsParam && idsParam.length > 0) {
      // Support both comma-separated and repeated ids
      let ids: string[] = [];
      idsParam.forEach((val) => {
        ids = ids.concat(val.split(','));
      });
      ids = ids.map((id) => id.trim()).filter(Boolean);
      if (ids.length === 0) {
        return NextResponse.json({ success: false, error: 'ids must be a non-empty array' }, { status: 400 });
      }
      const splashScreens = await SplashScreen.find({ _id: { $in: ids } });
      return NextResponse.json({ success: true, splashScreens }, { status: 200 });
    } else {
      // No ids param, return all
      const splashScreens = await SplashScreen.find();
      return NextResponse.json({ success: true, splashScreens }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}



export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const parsed = splashScreenSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors }, { status: 422 });
    }
    const splashScreen = await SplashScreen.create(parsed.data);
    return NextResponse.json({ success: true, splashScreen }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


