import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const fileId = resolvedParams.id;

    // 1. Authenticate with the VIP Token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 2. Fetch the raw bytes directly from the API (bypassing public CDN rules)
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'arraybuffer' } // Forces Google to return raw binary data
    );

    // 3. Convert to buffer and pipe to the client
    const buffer = Buffer.from(response.data as ArrayBuffer);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Tells the guest's browser to cache it for 24 hours so it doesn't drain your bandwidth
      },
    });

  } catch (error) {
    console.error("PROXY ERROR: Failed to stream image", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}