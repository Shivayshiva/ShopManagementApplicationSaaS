import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const { images }: { images: string[] } = await req.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const uploadResults = await Promise.all(
      images.map(async (image) => {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'shop-images',
          transformation: [{ width: 800, height: 800, crop: 'limit' }],
        })
        return uploadResponse?.secure_url
      })
    )

    return NextResponse.json({ urls: uploadResults })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
