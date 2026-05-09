import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/cloudinary/sign
// Generates a signed upload signature so the browser can upload
// directly to Cloudinary without exposing the API secret.
export async function POST(req: NextRequest) {
  try {
    const { folder } = await req.json();

    const apiSecret  = process.env.CLOUDINARY_API_SECRET;
    const apiKey     = process.env.CLOUDINARY_API_KEY;
    const cloudName  = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { error: 'Cloudinary not configured' },
        { status: 503 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);

    // Build the string to sign — params must be alphabetically sorted
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = createHash('sha256')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return NextResponse.json({ signature, timestamp, apiKey, cloudName });
  } catch (err) {
    console.error('[Cloudinary sign]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}