
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
